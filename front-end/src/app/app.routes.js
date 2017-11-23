(function () {
    'use strict';

    angular.module('app')
        .config(SidebarManager);

    function SidebarManager($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
        delete $httpProvider.defaults.headers.post['Content-Type'];
        delete $httpProvider.defaults.headers.put['Content-Type'];

        $locationProvider.hashPrefix('');
        $urlRouterProvider.otherwise('/home');

        $stateProvider
            .state('home', {
                url: '/home',
                template: '<home-comp></home-comp>'
            })
            .state('register-login', {
                url: '/register-login',
                template: '<register-login></register-login>'
            });
    }
})();
