var locator;
  var validAddress;
  require([
    "esri/tasks/locator", 
    "esri/SpatialReference",    
    "dojo/parser","dojo/dom", "dojo/on"
  ], function(
    Locator, 
    SpatialReference,
    parser,dom, on
  ) {
    parser.parse();

    locator = new Locator("http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer");
	  $('#btn-locate').on("click", locate);

		locator.on("address-to-locations-complete", function(evt) {
			if (evt.addresses.length > 0)
			{
				result = evt.addresses[0];
				$('#address').val(result.address);

				attributes = result.attributes;

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
						li_html += "<li><span class='divider'> > </span><a class='region-breadcrumb'>" + breadcrumbs[i] + "</a></li>";
				}
				if (breadcrumbs.length > 0)
					li_html += " Retailers";
				
				$('#bread-crumb').html(li_html);
				
				$("#spinner").addClass("hide");
				validAddress = true;
				$("#query").submit();
			}
		});
		function locate() {
	    var address = {
	       SingleLine: dom.byId("address").value
	    };
	    var options = {
	      address: address,
	      outFields: ["*"]
	    };
	    validAddress = false;
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
	});