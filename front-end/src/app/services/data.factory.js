(function() {
    'use strict';
  
    angular.module('app')
      .factory('Data', Data);
  
    function Data($http, $templateCache, config) {
        return {
            getPlaces: function (lat, lon) {
                var latlon = lat + ',' + lon;
                var url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+ latlon + '&radius=1000&type=museum,restaurant,store&key=AIzaSyAP8-ENK_mqn03eHtSo-YGoJgNCQME1o5U'
                return $http.get(url);
            }
        }
    }
  })();