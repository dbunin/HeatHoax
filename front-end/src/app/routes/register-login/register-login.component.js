(function() {
  'use strict';

  angular.module('app')
    .component('registerLogin', {
      templateUrl: 'app/routes/register-login/register-login.tpl.html',
      controller: RegisterLoginCtrl,
      controllerAs: 'RegisterLogin'
    });

  function RegisterLoginCtrl($scope, LeafletMap, Data) {

    function init() {
      LeafletMap.initMap('map');
    }

    init();
  }
})();
