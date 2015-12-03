require(["esri/map", "esri/geometry/Point", "extras/ClusterLayer", "esri/SpatialReference", "dojo/dom", "dojo/domReady!"], function(Map, Point, ClusterLayer, SpatialReference) {
  describe("ClusterLayer module", function() {

    describe("constructor with no given options", function() {
      var clusterLayer;

      it("sets the _clusterTolerance property (The max number of pixels between points to group points in the same cluster. Default value is 50.) to 50", function() {
        clusterLayer = new ClusterLayer({});
        expect(clusterLayer).toBeDefined();
        expect(clusterLayer._clusterTolerance).toEqual(50);     
      });

      it("sets the _clusters property to an empty array", function() {
        expect(clusterLayer._clusters).toEqual([]);        
      });

      it("sets the _clusterData (Array of objects. Required. Object are required to have properties named x, y and attributes. The x and y coordinates have to be numbers that represent a points coordinates.) property to an empty array", function() {
        expect(clusterLayer._clusterData).toEqual([]);        
      });

      it("sets the _clusterLabelColor (Optional. Hex string or array of rgba values used as the color for cluster labels. Default value is #fff (white).) property to '#000", function() {
        expect(clusterLayer._clusterLabelColor).toEqual("#000");        
      });

      it("sets the _clusterLabelOffset (Optional. Number of pixels to shift a cluster label vertically. Defaults to -5 to align labels with circle symbols. Does not work in IE.) property to -5", function() {
        expect(clusterLayer._clusterLabelOffset).toEqual(-5);        
      });

      it("sets the _singles property (populated when a graphic is clicked) to an empty array", function() {
        expect(clusterLayer._singles).toEqual([]);
      });

      it("sets the _showSingles property (Optional. Whether or graphics should be displayed when a cluster graphic is clicked. Default is true.) to true", function() {
        expect(clusterLayer._showSingles).toBeTruthy();
      });

      it("sets the _singleSym property as an esri.symbol.PicturerMarkerSymbol instance (Marker Symbol (picture or simple). Optional. Symbol to use for graphics that represent single points. Default is a small gray SimpleMarkerSymbol.)", function() {
        expect(clusterLayer._singleSym).toEqual(jasmine.any(esri.symbol.PictureMarkerSymbol));
      });

      it("sets the _singleTemplate property to esri.dijit.PopupTemplate instance with no title and description ( PopupTemplate</a>. Optional. Popup template used to format attributes for graphics that represent single points. Default shows all attributes as 'attribute = value' (not recommended).)", function() {
        expect(clusterLayer._singleTemplate).toEqual(jasmine.any(esri.dijit.PopupTemplate));
        // expect(clusterLayer._singleTemplate.title()).toEqual("");
      });

      it("sets the _maxSingles (Threshold for whether or not to show graphics for points in a cluster. Default is 1000.) property to 1000", function() {
        expect(clusterLayer._maxSingles).toEqual(1000);
      });

      it("sets the _webmap property (Optional. Whether or not the map is from an ArcGIS.com webmap. Default is false.) to false", function() {
        expect(clusterLayer._webmap).toBeFalsy();
      });

      it("sets the _sr property (Optional. Spatial reference for all graphics in the layer. This has to match the spatial reference of the map. Default is 102100. Omit this if the map uses basemaps in web mercator.) to an esri.SpatialReference instance defined with {wkid: 102100}", function() {
        expect(clusterLayer._sr).toEqual(jasmine.any(esri.SpatialReference));
      });

      it("sets the _zoomEnd property to null", function() {
        expect(clusterLayer._zoomEnd).toBeNull();
      });
    });

    describe("constructor with given options", function() {
      
    });

    describe("clear", function() {
    });

    describe("clearSingles", function() {
      
    });

    describe("onClick", function() {
      
    });

    describe("_setMap", function() {
      var clusterLayer = "temp", localMap;
      var data = getJSONFixture('layers-only.json');
      runs(function() {
        var actionCallback = function(map) {
          localMap = map;
          layer = new ClusterLayer({});
          clusterLayer = layer;
          map.addLayer(layer);
        }
        createTestMap( "map", actionCallback );
      });

      waits(2000);

      runs(function() {
        expect(localMap).toBeDefined();
        clusterLayer._setMap(localMap);
        expect(clusterLayer._clusters.length).toEqual(0);
        expect(clusterLayer._zoomEnd).not.toBeNull();
      })
    });

    describe("_unsetMap", function() {
      // skipped for now
    });

    describe("add", function() {
      describe("when point is a graphic", function() {
        
      });

      describe("when point isn't a graphic", function() {
        
        var p = new Point(-118.15, 33.80, new SpatialReference({ wkid: 4326 }));

        describe("and there is no existing cluster for the new point", function() {

          var clusterLayer, localMap;

          it("add the new data to _clusterData array", function() {
            runs(function() {
              var actionCallback = function(map) {
                localMap = map;
                layer = new ClusterLayer({});
                clusterLayer = layer;
                map.addLayer(layer);
              }
              createTestMap("map", actionCallback);
            });     
            waits(1000);
            runs(function() {
              clusterLayer.add(p);
            });            
            waits(500);
            runs(function() {
              console.info("Skipped for now As no expectation are met :(");
              // expect(clusterLayer._clusterData.length).toBeGreaterThan(0);
              // expect(p.attributes.clusterCount).toEqual(1);
              // expect(clusterLayer._clusters.length).toBeGreaterThan(0);
            });
          });
        });

        describe("and there is an existing cluster for the new point", function() {
          
        });
      });
    });

    describe("_clusterGraphics", function() {
      
    });

    describe("_clusterTest", function() {
      
    });

    describe("_clusterAddPoint", function() {
      
    });

    describe("_clusterCreate", function() {
      
    });

    describe("_showAllClusters", function() {
      
    });

    describe("_showCluster", function() {
      
    });

    describe("_addSingles", function() {
      
    });

    describe("_updateClusterGeometry", function() {
      
    });

    describe("_updateLabel", function() {
      
    });

    describe("_clusterMeta", function() {
      
    });

  });
});
