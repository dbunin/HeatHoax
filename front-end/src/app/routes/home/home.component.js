(function() {
  'use strict';

  angular.module('app')
    .component('homeComp', { 
      templateUrl: 'app/routes/home/home.tpl.html',
      controller: HomeCtrl,
      controllerAs: 'Home',
      replace: true
    });

  function HomeCtrl($scope, LeafletMap, Data) {
    var map;
    var vm = this;
    vm.routes = {
      intro: 'intro',
      explore: 'explore',
      favorites: 'favorites',
      login_register: 'login_register',
      register: 'register',
      login: 'login',
      edit_admin: 'edit_admin'
    };
    vm.showingRoute = vm.routes.intro;
    vm.selectedMonth = 0;
    vm.selectedCity = undefined;
    vm.cityInformation = undefined;
    
    function init() {
      map = LeafletMap.initMap('map');
      createEventHandlers();
    }

    function createEventHandlers() {
      map.on('click', function(event) {
        console.log(event.latlng);
        getPlacesSuggestions(event.latlng);
      })
    }

    function getTempAndCoordinates(month) {
      Data.getTempAndCoordinates(month).then(function(res){
        var temperatures_and_coordinates = []
        var json = res.data;
<<<<<<< HEAD
=======
        var count = 0
>>>>>>> d589fc5fc9afc2746b9afb7a83fc0ed5ee09e862
        temperatures_and_coordinates = _.map(json, function(value) {
          
          var temp = Math.round(100*(value['averageTemperature'] + 30)/80)/100;
          if(value['averageTemperature']<0){
            count++
            console.log('count: ' + count)
            console.log(value['averageTemperature'])
            console.log(temp)
          }
          return {lat: parseFloat(value['longitude'])||0, lng: parseFloat(value['latitude'])||0, count: temp||0 }
        })
<<<<<<< HEAD
=======
        
        console.log(temperatures_and_coordinates);

        LeafletMap.removeTempOverlay();
>>>>>>> d589fc5fc9afc2746b9afb7a83fc0ed5ee09e862
        LeafletMap.renderHeatmap(temperatures_and_coordinates);
      })
    }

    function getPlacesSuggestions(latlng) {
      Data.getPlaces(latlng.lat, latlng.lng).then(function(res){
        if (res.data.results.length > 0) {
          vm.cityInformation = {};
          vm.cityInformation.places = res.data;
          vm.cityname = vm.cityInformation.places.results[0].name;
          getPossibleRoutes(vm.selectedCity, vm.cityname);
          vm.showRoute(vm.routes.explore);
        } else {
          vm.cityInformation = undefined;
        }
      })
    }

    vm.placeAutocomplete = function(val) {
      return Data.placeAutocomplete(val).then(function(response){
        return response.data.places.map(function(item){
          return item.shortName;
        });
      });
    };

    function getPossibleRoutes(from, to) {
      Data.getPossibleRoutes(from, to).then(function(res) {
          console.log(res);
      })
    }

    vm.onMonthSelected = function(month) {
      getTempAndCoordinates(month);
    }

    vm.showRoute = function(route) {
      vm.showingRoute = route;
    }


    init();
  }
})();
