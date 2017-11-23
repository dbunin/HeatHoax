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
    
    function init() {
      
      LeafletMap.initMap('map');
      // <suggestions></suggestions>
      LeafletMap.createControl({name: "suggestions", position: 'bottomright', component: '<suggestions class="suggestions"></suggestions>', containerClassName: "suggestions"})
    }

    init();
  }
})();
