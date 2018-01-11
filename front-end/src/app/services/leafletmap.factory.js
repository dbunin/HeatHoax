(function() {
    'use strict';
  
    angular.module('app')
      .factory('LeafletMap', LeafletMap);
  
    function LeafletMap(config, Overlay, GeoUtils, Data, $compile, $rootScope) {
        var controls = {};
        var map;

        return {
            initMap: function () {
                map = L.map('map').setView([39.5, -0.5], 5);

                // Set up the OSM layer
                L.tileLayer(
                    'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', 
                    {maxZoom: 18}).addTo(map);

                return map;
                
            },
            getMap: function() {
                return map;
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
  