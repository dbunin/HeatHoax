(function() {
    'use strict';
  
    angular.module('app')
      .factory('Data', Data);
  
    function Data($http, $templateCache, config) {
        var vars = {
            googleApiKey: 'AIzaSyAP8-ENK_mqn03eHtSo-YGoJgNCQME1o5U',
            googleApiKey2: 'AIzaSyA-5ZyCnDpAoLcBwSjeFrVsJ8xMrFgMyQ8',
            rome2rioApiKey: 'yTPnfnRY'
        }
        return {
            getPlaces: function (lat, lon) {
                var latlon = lat + ',' + lon;
                var url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+ latlon + '&radius=1000&type=museum,restaurant,store&key='+ vars.googleApiKey + '';
                return $http.get(url);
            },
            getCityByCoordinates: function(lat, lon) {
                var latlon = lat + ',' + lon;
                var url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+ latlon + '&key='+ vars.googleApiKey2 + '&sensor=false';
                return $http.get(url);
            },
            getTempAndCoordinates: function (month) {
                return $http.get('http://145.220.75.104:10001/countries/' + month);
            },
            placeAutocomplete: function(place) {
                return $http.get('http://free.rome2rio.com/api/1.4/json/Autocomplete?key='+ vars. rome2rioApiKey +'&query=' + place + '')
            },
            getPossibleRoutes: function(from, to) {
                return $http.get('http://free.rome2rio.com/api/1.4/json/Search?key='+ vars. rome2rioApiKey +'&oName=' + from + '&dName=' + to + '&noRideshare')
            }
        }
    }
  })();