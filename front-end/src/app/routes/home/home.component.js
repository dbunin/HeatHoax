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
    vm.cityInformation = undefined;
    
    function init() {
      
      var map = LeafletMap.initMap('map');

      map.on('click', function(event) {
        console.log(event.latlng);

        Data.getPlaces(event.latlng.lat, event.latlng.lng).then(function(res){
          console.log(res);
          if (res.data.results.length > 0) {
            vm.cityInformation = {};
            vm.cityInformation.places = res.data;
            vm.cityname = vm.cityInformation.places.results[0].name;
            vm.showRoute(vm.routes.explore);
          } else {
            vm.cityInformation = undefined;
          }
        })
      })
      // <suggestions></suggestions>
      // LeafletMap.createControl({name: "suggestions", position: 'bottomright', component: '<suggestions class="suggestions"></suggestions>', containerClassName: "suggestions"})
    }

    vm.onMonthSelected = function(month) {
      Data.getTempAndCoordinates(month).then(function(res){
        console.log(month)
        var temperatures_and_coordinates = []
        var json = res.data;
        var count = 0
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
        
        console.log(temperatures_and_coordinates);

        LeafletMap.removeTempOverlay();
        LeafletMap.renderHeatmap(temperatures_and_coordinates);

          console.log(temperatures_and_coordinates)
          console.log(json)
      })
    }


    vm.showRoute = function(route) {
      vm.showingRoute = route;
    }


    init();
  }
})();
