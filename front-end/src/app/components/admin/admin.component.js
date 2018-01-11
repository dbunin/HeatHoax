(function () {
    'use strict';

    angular.module('app')
        .component('admin', {
            templateUrl: 'app/components/admin/admin.tpl.html',
            controller: AdminCtrl,
            controllerAs: 'Admin',
            replace: true
        });

    function AdminCtrl($scope, LeafletMap, Data, User) {
        var vm = this;
        vm.user = undefined;
        vm.selectedRoute = 'login-register' //either 'register' or 'login' or 'login-register' (default)

        function init() {
            vm.loggedIn = User.loggedIn();
        }

        vm.selectRoute = function (route) {
            vm.selectedRoute = route;
        };

        vm.login = function (loginEmail, loginPassword) {
            User.login(loginEmail, loginPassword).then(function (res) {
                console.log(res);
                if (res.result === 'Success') {
                    console.log('success')
                    vm.loggedIn = true;
                    vm.user = User.get();
                }
            })
        };

        vm.register = function (registerEmail, registerPassword) {
            User.register(registerEmail, registerPassword).then(function (res) {
                if (res.result === 'Registered') {
                    vm.loggedIn = true;
                    vm.user = User.get();
                }
            })
        };

        init();
    }
})();