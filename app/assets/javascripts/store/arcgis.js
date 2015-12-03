dojo.require("dojo/parser");
dojo.require("dijit.layout.ContentPane");
dojo.require("dijit.layout.BorderContainer");
dojo.require("esri.tasks.geometry");

require(["esri/map", "esri/tasks/locator", "esri/geometry/Extent", "esri/geometry/webMercatorUtils", 
		"extras/ClusterLayer", "esri/tasks/query", "esri/tasks/QueryTask", "esri/geometry/Multipoint", 
		"esri/SpatialReference", "dojo/on"],

function(Map, Locator, Extent, webMercatorUtils, ClusterLayer, Query, QueryTask, Multipoint, SpatialReference, on) {
	try
	{
		dojo.parser.parse();
	}
	catch(err){

	}
	var initial = true;
	var FIPS = [];
	var map, clusterLayer = null;
	var popupOptions = {
		"markerSymbol": new esri.symbol.SimpleMarkerSymbol("circle", 20, null, new dojo.Color([0, 0, 0, 0.25])),
		"marginLeft": "20",
		"marginTop": "20"
	};

	/**--------------------Query demographic data------------------------*/
	queryTask = new QueryTask("http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Demographics/ESRI_Census_USA/MapServer/1");
	
	query = new Query();
	var mp = new Multipoint(new SpatialReference({wkid:4326}));
	query.returnGeometry = false;

	map = new esri.Map("map", {
		basemap: "streets",
		center: [-118.251707, 34.060428],
		zoom: 13
	});

	// geocoder = new esri.dijit.Geocoder({ 
	// 	map: map,
	// 	autoComplete: true,
	// 	arcgisGeocoder: 
	// 	{
	// 		name: "Esri World Geocoder"
	// 	}
	// }, dojo.byId("search"));

	// geocoder.startup();

	locator = new Locator("http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer");
  $('#btn-locate').on("click", locate);

	locator.on("address-to-locations-complete", function(evt) {
		if (evt.addresses.length > 0)
		{
			result = evt.addresses[0];
			$('#address').val(result.address);

			attributes = result.attributes;

			var minx = parseFloat(attributes.Xmin);
      var maxx = parseFloat(attributes.Xmax);
      var miny = parseFloat(attributes.Ymin);
      var maxy = parseFloat(attributes.Ymax);
      var lng = 0;
      var lat = 0;
      var no_results = true;

      // check whether retailers exist or not in searched area
      for (var i = 0; i < clusterLayer._clusterData.length; i++)
      {
      	lon = clusterLayer._clusterData[i].lon;
				lat = clusterLayer._clusterData[i].lat;
      	if (minx < lon && maxx > lon && miny < lat && maxy > lat)
      	{
      		no_results = false;
      		break;
      	}
      }
      if (no_results == true)
      {
      	alert("There are no retailers in this area. Please input other address.");
      	$("#spinner").addClass("hide");
      	return;
      }

      var esriExtent = new Extent(minx, miny, maxx, maxy, new SpatialReference({wkid:4326}));
      map.setExtent(webMercatorUtils.geographicToWebMercator(esriExtent));

			$('#country').val(attributes.Country);
			$('#state').val(attributes.Region);
			$('#city').val(attributes.City);
			$('#zipcode').val(attributes.Postal);
			// Set Breadcrumb
			breadcrumbs = new Array();

	  	var li_html = "<li><a href='" + action + "'>Home</a></li>";
			if (attributes.Region != "") breadcrumbs.push(attributes.Region);
			if (attributes.City != "") breadcrumbs.push(attributes.City);
			if (attributes.Postal != "") breadcrumbs.push(attributes.Postal);

			for (var i = 0; i < breadcrumbs.length; i++)
			{
				if (i == breadcrumbs.length - 1) // last
					li_html += "<li><span class='divider'> > </span>" + breadcrumbs[i] + "</li>";
				else
					li_html += '<li><span class="divider"> > </span><a href="javascript:clickBreadcrumb(\''+ breadcrumbs[i]+ '\');">' + breadcrumbs[i] + '</a></li>';
			}
			if (breadcrumbs.length > 0)
				li_html += " Retailers";
			
			$('#bread-crumbs').html(li_html);

			var x = result.location.x.toFixed(5);
      var y = result.location.y.toFixed(5);

			zoomTo(y, x);
			$("#spinner").addClass("hide");
		}
	});

	function zoomTo(lat, lon) {
    require([
      "esri/geometry/Point", "esri/geometry/webMercatorUtils"
    ], function(Point, webMercatorUtils) {
      var point = new Point(lon, lat, {
        wkid: "4326"
      });
      var wmpoint = webMercatorUtils.geographicToWebMercator(point);
      map.centerAt(wmpoint);
    });
  }

	//Perform the geocode. This function runs when the "Locate" button is pushed.
  function locate() {
    var address = {
       SingleLine: $("#address").val()
    };
    var options = {
      address: address,
      outFields: ["*"]
    };
    //optionally return the out fields if you need to calculate the extent of the geocoded point
    locator.addressToLocations(options);
    $("#spinner").removeClass("hide");
    setTimeout(function(){
    	$("#spinner").addClass("hide");
    	if (validAddress == false) // does not loaded yet
    	{
    		$("#address").val("");
    		$("#address").attr("placeHolder", "Invalid Zipcode");
    	}
    }, 6000);
  };

	map.on("load", function() {
		map.disableScrollWheelZoom();
		map.disableKeyboardNavigation();

		// hide the popup's ZoomTo link as it doesn't make sense for cluster features
		dojo.style(dojo.query("a.action.zoomTo")[0], "display", "none");

		// initFunctionality(map);

		// get retailer's information
		var retailers = esri.request({
			"url": "/api/products",
			"handleAs": "json"
		});

		retailers.then(addClusters, error);
	});

	function addClusters(resp) {
		var photoInfo = {};
		var image_content;
		var wgs = new esri.SpatialReference({
			"wkid": 4326
		});
		photoInfo.data = dojo.map(resp.products, function(p) {
			var property = {};

			// Property table to show the properties such as name, address, position, etc
			var table_content = "";    

			property.address = "No Retailer";
			for (var i = 0; i < p.product_properties.length; i++)
			{
				property[p.product_properties[i].property_name.toLowerCase()] = p.product_properties[i].value;
				
        table_content += "<tr><td><strong>" + p.product_properties[i].property_name + "</strong></td>" +
          "<td>" + p.product_properties[i].value + "</td></tr>";
			}

			// var property_table_content = property_table_start_tag + table_content + property_table_end_tag;

			// Translate coordinate

			// If lat/lon data does not exist, fill in random values. -- development
			var lon = property.longitude == null ? parseFloat(-118.235178 + Math.random() * 0.1) : property.longitude;
			var lat = property.latitude == null ? parseFloat(34.056177 + Math.random() * 0.1) : property.latitude;
			
			var latlon = new esri.geometry.Point(lon, lat, wgs);
			// var latlon = new esri.geometry.Point(parseFloat(property.lon), parseFloat(property.lat), wgs);
			var webMercator = esri.geometry.geographicToWebMercator(latlon);

			var carousel_tags = "";
			var images = p.variants[0].images;
			for (i = 0; i < images.length; i++)
			{
				if (i === 0)
					active = "active";
				else
					active = "";
				var carousel_tag = "<div class='item "+ active + "'>" + 
							"<img src='" + images[i].attachment_url +"' style='width:100%;' alt=''>"+
							"<div class='carousel-caption'>"+
								p.name+
							"</div>"+
						"</div>";
				carousel_tags += carousel_tag;
			}
			
			if (images.length === 0)
				image_content = "";
			else if (images.length == 1)
				image_content = "<img src='" + images[0].attachment_url +"' style='width:100%;' alt=''>";
			else
			{
				image_content = 
				"<div id='carousel-example-generic' class='carousel slide'>" +
					"<div class='carousel-inner'>"+
					carousel_tags +
					"</div>"+

					"<!-- Controls -->"+
					"<a class='left carousel-control' href='#carousel-example-generic' data-slide='prev'>"+
						"<span class='icon-prev'><</span>"+
					"</a>"+
					"<a class='right carousel-control' href='#carousel-example-generic' data-slide='next'>"+
						"<span class='icon-next'>></span>"+
					"</a>"+
				"</div>";
			}
			var attributes = {
				"name": p.name,
				"permaLink": p.permalink,
				"price": parseInt(p.price),
				"address": property.address,//property.Location,
				"image_content": image_content,
				"property_table": table_content,
				"census_table": ""
			};
			
			return {
				"x": webMercator.x,
				"y": webMercator.y,
				"lon": lon,
				"lat": lat,
				"visible": true,
				"attributes": attributes
			};
		});

		var template = new esri.InfoTemplate();
		template.setTitle("<b>${name}</b>");
		var table_start_tag = "<table class='table-hover' style='width:100%'><tbody>";
		var table_end_tag = "</tbody></table>";
		var census_table = table_start_tag + "${census_table}" + table_end_tag;
		var property_table = table_start_tag + "${property_table}" + table_end_tag;
		price_bar_template = "<div class='price-bar'><span class='price'>$${price} per Month </span><a href='/products/${permaLink}' class='btn btn-warning'>BID</a></div>";
		template.setContent("<div class='rows'><div style='width:195px; float:left;'>${image_content}" + census_table + "</div>" +
			"<div style='width:200px; float:left;'><div class='retailer_props_table'>" + property_table + "</div>" + price_bar_template + "</div></div>");

		// cluster layer that uses OpenLayers style clustering
		clusterLayer = new extras.ClusterLayer({
			"data": photoInfo.data,
			"distance": 100,
			"id": "clusters",
			"labelColor": "#fff",
			"labelOffset": 10,
			"resolution": map.extent.getWidth() / map.width,
			"singleColor": "#888",
			"singleTemplate": template
		});
		initialize();
		var defaultSym = new esri.symbol.SimpleMarkerSymbol().setSize(4);
		var renderer = new esri.renderer.ClassBreaksRenderer(
		defaultSym,
			"clusterCount");
		var blue = new esri.symbol.PictureMarkerSymbol("http://static.arcgis.com/images/Symbols/Shapes/BluePin1LargeB.png", 48, 48).setOffset(0, 15);
		var green = new esri.symbol.PictureMarkerSymbol("http://static.arcgis.com/images/Symbols/Shapes/GreenPin1LargeB.png", 56, 56).setOffset(0, 15);
		var red = new esri.symbol.PictureMarkerSymbol("http://static.arcgis.com/images/Symbols/Shapes/RedPin1LargeB.png", 80, 80).setOffset(0, 15);
		renderer.addBreak(0, 2, green);
		renderer.addBreak(2, 1000, green);

		clusterLayer.setRenderer(renderer);
		map.addLayer(clusterLayer);

		// close the info window when the map is clicked
		map.on("click", cleanUp);
		// close the info window when esc is pressed
		map.on("key-down", function(e) {
			if (e.keyCode == 27) {
				cleanUp();
			}
		});
	}
	
	var outputFields = {
		"TOTPOP_CY" : "Total Population", 
		"MEDHINC_CY": "Median Income",
		"HINCBASECY": "Households",
	};

	var income_keys = ["HINC25_CY",	"HINC25_50_CY",	"HINC50_CY", "HINC75_CY",
		"HINC100_CY",	"HINC150_CY",	"HINC200_CY"];
	
	var age_queries = ["AGE_22_29 > 0", "AGE_30_39 > 0","AGE_40_49 > 0","AGE_50_64 > 0","AGE_65_UP > 0"];
	var income_queries = [];
	
	age_query = "";

	$('#div-race li').click(function(event)
	{
	  var value = $(this).text().toUpperCase().replace(/ /g, '_') + " > 0";
	  if ($(this).hasClass('selected') == true)
	  {
	    $(this).removeClass('selected');
	    var index = queries.indexOf(value);
	    if (index >= 0)
	      queries.slice(index, 1); // remove selected query
	  }
	  else
	  {
	    $(this).addClass('selected');
	    queries.push(value);
	  }
	  execute();
	  
	});

	$('#btn-male-search').click(function(event)
	{
		var min_age = Math.min($("#min_male_age").val(), $("#min_female_age").val());
		var max_age = Math.max($("#max_male_age").val(), $("#max_female_age").val());

	  age_query = age_queries.slice(min_age, max_age).join(" AND ");
	  execute();
	});

	$('#btn-female-search').click(function(event)
	{
		var min_age = Math.min($("#min_male_age").val(), $("#min_female_age").val());
		var max_age = Math.max($("#max_male_age").val(), $("#max_female_age").val());

	  age_query = age_queries.slice(min_age, max_age).join(" AND ");
	  execute();
	});

	$('#btn-income-search').click(function(event)
	{
		var min_income = $("#min_income").val();
	  var max_income = $("#max_income").val();

	  income_queries = income_keys.slice(min_income, max_income);
	  execute();
	});

	function execute(first) {
		if (clusterLayer === null)
			return;

		if (age_query != "")
		{
			query.where = age_query + " AND MALES > 0 AND FEMALES > 0";
		}
		console.log(query.where);
		// query.outFields = ["FIPS", "POP2007","HOUSEHOLDS","MALES","FEMALES","WHITE","BLACK","ASIAN","OTHER","HISPANIC","AGE_UNDER5","AGE_5_17","AGE_18_21","AGE_22_29","AGE_30_39","AGE_40_49","AGE_50_64","AGE_65_UP"];
		query.outFields = ["OBJECT_ID"];

		var data = clusterLayer._clusterData;
		mp.points = [];
		var length = data.length;
		for ( var i = 0; i < length; i++) {
			mp.points.push([data[i].lon, data[i].lat]);
		}
		query.geometry = mp;
		query.outSpatialReference = {"wkid":102100};
		//execute query
		queryTask.execute(query, showResults);
	}

	function initialize()
	{
		queryInitTask = new QueryTask("http://server.arcgisonline.com/ArcGIS/rest/services/Demographics/USA_Median_Household_Income/MapServer/1");

		query.outFields = ["OBJECT_ID"];
		// Fetch output fields and push to query.outFields
		for (att in outputFields) {
			query.outFields.push(att);
		}

		var data = clusterLayer._clusterData;
		mp.points = [];
		var length = data.length;
		for ( var i = 0; i < length; i++) {
			mp.points.push([data[i].lon, data[i].lat]);
		}
		query.geometry = mp;
		query.outSpatialReference = {"wkid":102100};
		//execute query
		console.log(query);
		queryInitTask.execute(query, initializeData);
	}

	function initializeData(results)
	{
		var length = clusterLayer._clusterData.length;
		for ( var i = 0; i < length; i++) {
      clusterLayer._clusterData[i].visible = true;
			var census_table = "";
			var featureAttributes = results.features[i].attributes;
			FIPS[i] = featureAttributes["OBJECT_ID"];
			for (att in featureAttributes) {
				if (att == "OBJECT_ID")
					continue;

				clusterLayer._clusterData[i].attributes[att] = featureAttributes[att];
				if (att == "TOTPOP_CY" || att == "HINCBASECY")
					census_table += "<tr><td><strong>" + outputFields[att] + "</strong></td><td>" + featureAttributes[att] + "</td></tr>";
				if (att == "MEDHINC_CY")
					census_table += "<tr><td><strong>" + outputFields[att] + "</strong></td><td>$" + featureAttributes[att] + "</td></tr>";
      }
      clusterLayer._clusterData[i].attributes["census_table"] = census_table;
    }
  }

  function showResults(results) {
    var s = "";
    var visible = 0;
    var unmatched = true;
    var last_lat, last_lon;
    // Sets FIPS to retailer information manually

    var length = clusterLayer._clusterData.length;
    for ( var i = 0; i < length; i++) {
      clusterLayer._clusterData[i].visible = false; // Set all clusters invisible
    }
    for (i=0, il=results.features.length; i<il; i++) {
      var featureAttributes = results.features[i].attributes;
      index = FIPS.indexOf(featureAttributes["OBJECT_ID"]);
      if (index != -1) // validate
      {
        unmatched = false;

        // validate with income queries.
        for (var k = 0; k < income_queries.length; k++)
        {
          if (parseInt(clusterLayer._clusterData[index].attributes[income_queries[k]], 10) === 0)
          {
            unmatched = true
            break;
          }
        }
        if (unmatched === true)
          continue;

        clusterLayer._clusterData[i].visible = true; // if this matches the conditions, show this
        last_lat = clusterLayer._clusterData[i].lat;
        last_lon = clusterLayer._clusterData[i].lon;
        visible ++;
      }
    }
    
    zoomTo(last_lat, last_lon);
    map.setZoom(14);
    $("#search_result h5").html(visible + " retailers are founded");
    $("#search_result").css({ display: "block" });
    setTimeout(function(){
      $("#search-result").fadeOut('slow', function() {
        // Animation complete.
      });
    }, 5000);
    clusterLayer._setMap(map);
  }

  function cleanUp() {
    map.infoWindow.hide();
    clusterLayer.clearSingles();
  }

  function error(err) {
    console.log("something failed: ", err);
  }

  // show cluster extents 

  function showExtents() {
    var extents = new esri.layers.GraphicsLayer();
    var sym = new esri.symbol.SimpleFillSymbol().setColor(new dojo.Color([205, 193, 197, 0.5]));
    dojo.forEach(clusterLayer._clusters, function(c) {
      var e = c.attributes.extent;
      extents.add(new esri.Graphic(new esri.geometry.Extent(e[0], e[1], e[2], e[3]), sym));
    }, this);
    map.addLayer(extents, 0);
    console.log("added extents");
  }
});