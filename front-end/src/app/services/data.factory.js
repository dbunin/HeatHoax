(function() {
    'use strict';
  
    angular.module('app')
      .factory('Data', Data);
  
    function Data($http, $templateCache, config) {
        return {
            getBreweries: function () {
                return $http.get('data/breweries.json');
            }
        }
    }
  })();