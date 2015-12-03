require(["dojo/parser", "esri/map", "extras/ClusterLayer", "esri/tasks/query", "esri/tasks/QueryTask", "esri/geometry/Multipoint", "esri/SpatialReference", "dojo/dom", "dojo/on", "esri/dijit/Geocoder", "dijit/layout/ContentPane", "dijit/layout/BorderContainer", "esri/geometry", "dojo/domReady!"],

function (parser, Map, ClusterLayer, Query, QueryTask, Multipoint, SpatialReference, dom, on, Geocoder, ContentPane, BorderContainer, geometry) {
  parser.parse();
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
    zoom: 12
  });
  
  // create the geocoder
  geocoder = Geocoder({ 
    map: map,
    autoComplete: true,
    arcgisGeocoder: {
      name: "Esri World Geocoder"
    }
  }, dojo.byId("search"));
  
  geocoder.startup();
  
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
    var wgs = new SpatialReference({
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

      // If lat/lng data does not exist, fill in random values. -- development
      var lng = property.Longitude == null ? parseFloat(-118.235178 + Math.random() * 0.1) : property.Longitude;
      var lat = property.Latitude == null ? parseFloat(34.056177 + Math.random() * 0.1) : property.Latitude;
      
      var latlng = new geometry.Point(lng, lat, wgs);
      // var latlng = new esri.geometry.Point(parseFloat(property.lng), parseFloat(property.lat), wgs);
      var webMercator = geometry.geographicToWebMercator(latlng);

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
        "price": parseInt(p.price,10),
        "address": property.address,//property.Location,
        "image_content": image_content,
        "property_table": table_content,
        "census_table": ""
      };
      
      return {
        "x": webMercator.x,
        "y": webMercator.y,
        "lng": lng,
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
    clusterLayer = new ClusterLayer({
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
    var green = new esri.symbol.PictureMarkerSymbol("http://static.arcgis.com/images/Symbols/Shapes/GreenPin1LargeB.png", 64, 64).setOffset(0, 15);
    var red = new esri.symbol.PictureMarkerSymbol("http://static.arcgis.com/images/Symbols/Shapes/RedPin1LargeB.png", 80, 80).setOffset(0, 15);
    renderer.addBreak(0, 2, blue);
    renderer.addBreak(2, 200, green);
    renderer.addBreak(200, 1001, red);

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

  queries        = [];
  income_queries = [];
  
  var outputFields = {
    "TOTPOP_CY" : "Total Population", 
    "MEDHINC_CY": "Median Income",
    "HINCBASECY": "Households",
    "HINC25_CY" : "Household Income $0-$24,999",
    "HINC25_50_CY": "Household Income $25,000-$49,999",
    "HINC50_CY" : "Household Income $50,000-$74,999",
    "HINC75_CY" : "Household Income $75,000-$99,999",
    "HINC100_CY": "Household Income $100,000-$149,999",
    "HINC150_CY": "Household Income $150,000-$199,999",
    "HINC200_CY": "Household Income $200,000 or greater"
  };

  $('#div-men li').click(function(event)
  {
    var value = $(this).text().toUpperCase().replace(/ /g, '_') + " > 0";
    if ($(this).hasClass('selected'))
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

  $('#div-women li').click(function(event)
  {
    var value = $(this).text().toUpperCase().replace(/ /g, '_') + " > 0";

    if ($(this).hasClass('selected') === true)
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

  $('#div-race li').click(function(event)
  {
    var value = $(this).text().toUpperCase().replace(/ /g, '_') + " > 0";
    if ($(this).hasClass('selected') === true)
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

  $('#div-income li').click(function(event)
  {
    var value = $(this).attr('id');
    switch (value)
    {
      case "income0":
        value = "HINC25_CY";
        break;

      case "income1":
        value = "HINC25_50_CY";
        break;

      case "income2":
        value = "HINC50_CY";
        break;

      case "income3":
        value = "HINC75_CY";
        break;

      case "income4":
        value = "HINC100_CY";
        break;
    }

    if ($(this).hasClass('selected') === true)
    {
      $(this).removeClass('selected');
      var index = income_queries.indexOf(value);
      if (index >= 0)
        income_queries.slice(index, 1); // remove selected query
    }
    else
    {
      $(this).addClass('selected');
      income_queries.push(value);
    }
    execute();
  });

  function execute(first) {
    if (clusterLayer === null)
      return;

    if ($("#div-males li").hasClass("selected") === true && queries.indexOf("MALES") == -1)
      queries.push("MALES");
    if ($("#div-females li").hasClass("selected") === true && queries.indexOf("FEMALES") == -1)
      queries.push("FEMALES");

    var strQuery = queries.join(" AND ");
    console.log(strQuery);
    if (strQuery !== "")
    {
      query.where = strQuery;
    }
    
    // query.outFields = ["FIPS", "POP2007","HOUSEHOLDS","MALES","FEMALES","WHITE","BLACK","ASIAN","OTHER","HISPANIC","AGE_UNDER5","AGE_5_17","AGE_18_21","AGE_22_29","AGE_30_39","AGE_40_49","AGE_50_64","AGE_65_UP"];
    query.outFields = ["OBJECT_ID"];

    var data = clusterLayer._clusterData;
    mp.points = [];
    var length = data.length;
    for ( var i = 0; i < length; i++) {
      mp.points.push([data[i].lng, data[i].lat]);
    }
    query.geometry = mp;
    query.outSpatialReference = {"wkid":102100};
    //execute query
    queryTask.execute(query, showResults);
  }

  function initialize()
  {
    console.log("initialize");
    queryInitTask = new QueryTask("http://server.arcgisonline.com/ArcGIS/rest/services/Demographics/USA_Median_Household_Income/MapServer/1");

    query.outFields = ["OBJECT_ID"];
    // Fetch output fields and push to query.outFields
    for (var att in outputFields) {
      query.outFields.push(att);
    }
    console.log(query.outFields);

    var data = clusterLayer._clusterData;
    mp.points = [];
    var length = data.length;
    for ( i = 0; i < length; i++) {
      mp.points.push([data[i].lng, data[i].lat]);
    }
    query.geometry = mp;
    query.outSpatialReference = {"wkid":102100};
    //execute query
    queryInitTask.execute(query, initializeData);
  }

  function initializeData(results)
  {
    console.log("feched initialize data");
    var length = clusterLayer._clusterData.length;
    for ( var i = 0; i < length; i++) {
      clusterLayer._clusterData[i].visible = true;
      var census_table = "";
      var featureAttributes = results.features[i].attributes;
      FIPS[i] = featureAttributes["OBJECT_ID"];
      console.log(featureAttributes);
      for (var att in featureAttributes) {
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
        visible ++;
      }
    }
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