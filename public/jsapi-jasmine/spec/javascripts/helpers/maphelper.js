//helper that injects a div, creates a map and 
//fires a callback when it's ready to roll
function createTestMap(divId, mapReadyCallback){
    // $("body").append("<div id='" + divId + "' style='height:400px;width:400px'></div>");
    var map = new esri.Map(divId,{
        basemap:"streets",
        center:[-118.251707, 34.060428],
        zoom:12,
        sliderStyle:"small"
    });

    // selLayer = new esri.layers.GraphicsLayer();
    // layer = new ClusterLayer({});

    dojo.connect(map, "onLoad", function(theMap) {
        // theMap.addLayer(layer);
        mapReadyCallback(theMap);
        // console.info(theMap.height);
    });
}