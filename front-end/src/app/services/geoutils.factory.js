(function() {
    'use strict';
  
    angular.module('app')
      .factory('GeoUtils', GeoUtils);
  
    function GeoUtils() {
        return {
            pointInPolygon: function (ll, geometry) {
                return this.pointInPolygon({
                    type: 'Point',
                    coordinates: [ll.lng, ll.lat]
                }, geometry);
            },
            markersInPolygon: function (markers, geometry, first) {
                var results = [];
                for (var i = 0; i < markers.length; i++) {
                    var point = this.pointInPolygon(markers[i].getLatLng(), geometry);
                    if (point) {
                        results.push(markers[i]);
                        if (first) break;
                    }
                }
                return results;
            },
            revertCoordinates: function (coordinates) {
                if (!Array.isArray(coordinates[0])) {
                    var t = coordinates[0];
                    coordinates[0] = coordinates[1];
                    coordinates[1] = t;
                } else {
                    coordinates.forEach(function (ar) {
                        this.revertCoordinates(ar);
                    });
                }
                return coordinates;
            }
        }
    }
  })();