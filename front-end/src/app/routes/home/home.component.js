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

    vm.selectedMonth = 0;
    vm.cityInformation = undefined;
    
    function init() {
      
      var map = LeafletMap.initMap('map');

      map.on('click', function(event) {
        console.log(event.latlng);

        Data.getPlaces(event.latlng.lat, event.latlng.lng).then(function(res){
          vm.cityInformation = {};
          vm.cityInformation.places = res.data;
          vm.cityname = vm.cityInformation.places.results[0].name;
          console.log(res);
        })
      })
      // <suggestions></suggestions>
      // LeafletMap.createControl({name: "suggestions", position: 'bottomright', component: '<suggestions class="suggestions"></suggestions>', containerClassName: "suggestions"})
    }

    init();
  }
})();
