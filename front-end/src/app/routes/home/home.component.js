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
          console.log(res);
          if (res.data.results.length > 0) {
            vm.cityInformation = {};
            vm.cityInformation.places = res.data;
            vm.cityname = vm.cityInformation.places.results[0].name;
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
        angular.forEach(json, function(value){
          var temp = Math.round(100*(value['averageTemperature'] + 45)/90)/100
          temperatures_and_coordinates.push([value['latitude'], value['longitude'], temp])
        })

          console.log(temperatures_and_coordinates)
          console.log(json)
      })
    }

    init();
  }
})();
