(function() {
    'use strict';
  
    angular.module('app')
      .factory('User', UserFactory);
  
    function UserFactory($http, $templateCache, config) {
        var baseUrl = 'http://145.220.75.104:10001/'
        var user = undefined;
        return {
            get: function () {
                if (user) {
                    return user;
                }
            },
            loggedIn: function() {
                return !_.isUndefined(user);
            },

            login: function(email, password) {
                var resource = baseUrl + 'users/login/';
                var params = {
                    inputEmail: email,
                    inputPassword: password
                }
                return $http({
                    url: resource,
                    method: "POST",
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    data: $.param(params)
                }).then(function(res) {
                    user = params;
                    return res.data;
                });
            },
            register: function(email, password) {
                var resource = baseUrl + 'users/register/';
                var params = {
                    inputEmail: email,
                    inputPassword: password
                }
                return $http({
                    url: resource,
                    method: "POST",
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    data: $.param(params)
                }).then(function(res) {
                    user = params;
                    return res.data;
                });
            }
        }
    }
  })();