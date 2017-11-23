(function () {
  'use strict';

  angular.module('app').filter('extractFileExt', extractFileExt);

  function extractFileExt() {
    return function (item) {
      return item.split('.').pop();
    };
  }

})();
