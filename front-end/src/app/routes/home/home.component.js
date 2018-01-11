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

        // Data.getCityByCoordinates(event.latlng.lat, event.latlng.lng).then(function(res){
        //   console.log('city', res);
        // })
      })
      // <suggestions></suggestions>
      // LeafletMap.createControl({name: "suggestions", position: 'bottomright', component: '<suggestions class="suggestions"></suggestions>', containerClassName: "suggestions"})
    }


    vm.showRoute = function(route) {
      vm.showingRoute = route;
    }


    init();
  }
})();
