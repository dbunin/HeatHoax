(function() {
    'use strict';
  
    angular.module('app')
      .factory('LeafletMap', LeafletMap);
  
    function LeafletMap(config, Overlay, GeoUtils, Data, $compile, $rootScope) {
        var controls = {};
        var map, heatmapLayer;

        return {
            initMap: function () {
                map = new L.Map('map').setView([-37.87, 175.475], 12);
                L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png',
                    {maxZoom: 19}).addTo(map); 

                return map;
                
            },
            getMap: function() {
                return map;
            },
            renderHeatmap: function(data) {
                var testData = {
                    max: 1,
                    data: data
                };
                    
                    var cfg = {
                    // radius should be small ONLY if scaleRadius is true (or small radius is intended)
                    // if scaleRadius is false it will be the constant radius used in pixels
                    "radius": 7,
                    "maxOpacity": .5, 
                    // scales the radius based on map zoom
                    "scaleRadius": false, 
                    // if set to false the heatmap uses the global maximum for colorization
                    // if activated: uses the data maximum within the current map boundaries 
                    //   (there will always be a red spot with useLocalExtremas true)
                    "useLocalExtrema": true,
                    // which field name in your data represents the latitude - default "lat"
                    latField: 'lat',
                    // which field name in your data represents the longitude - default "lng"
                    lngField: 'lng',
                    // which field name in your data represents the data value - default "value"
                    valueField: 'count',
                    blur: 0.2,
                    gradient: { 
                    '0.00': 'white',    
                    '0.20': 'blue', 
                    '0.40': 'green',
                    '0.65': 'yellow',
                    '0.80': 'orange',
                    '1': 'red'
                    }
                };
                heatmapLayer = new HeatmapOverlay(cfg).addTo(map);
                console.log(testData);
                heatmapLayer.setData(testData);
    
            },
            removeTempOverlay: function() {
                if(heatmapLayer) {
                    heatmapLayer.remove();
                }
            },
            createControl: function(control) {
                // {name: "suggestions", position: 'bottom', component: "<suggestions></suggestions>", containerClassName: "suggestions"}
                    controls[control.name] = L.control({position: control.position});
                    var divContainer;
        
                    controls[control.name].onAdd = function () {
                        divContainer = L.DomUtil.create('div');
                        divContainer.className = control.containerClassName;
                        L.DomEvent.on(divContainer, 'mousewheel', L.DomEvent.stopPropagation);
                        L.DomEvent.on(divContainer, 'mousedown', L.DomEvent .stopPropagation);
                        L.DomEvent.on(divContainer, 'click', L.DomEvent.stopPropagation);
                        L.DomEvent.disableClickPropagation(divContainer);
        
                        //holds the information of the legend
                        var element = document.createElement('div');
                        element.innerHTML = control.component;
                        $compile(element)($rootScope.$new());
        
                        //Append to the divContainer element
                        divContainer.appendChild(element);
        
                        return divContainer;
                    };
                    controls[control.name].addTo(map);
            }
        }
    }
  })();
  