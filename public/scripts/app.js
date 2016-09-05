angular.module('StravaAnalyticsApp', ['ngCookies', 'ngRoute']).config(function ($routeProvider) {
  
  'use strict';

  var tryExtractCode = function(path) {
    function extractCode(queryString) {
      var match = /[&?\/]code=([^&]*)/.exec(queryString);
      return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
    }
    var code = extractCode(path);
    return code;
  };
  
  var authenticationCheck = function(showPageOnAuthCookieNotFound) {
    return function($q, $window, $cookies, $location, stravaApi) {
      var deferred = $q.defer(); 
      var code = tryExtractCode($window.location.href);
      if (code) {
        stravaApi.getToken(code).then(function (token) {
          var expiry = new Date();
          expiry.setDate(expiry.getDate() + 30);
          $cookies.put('auth', 1, {expires: expiry});
          $window.sessionStorage['stravaToken'] = token['access_token'];
          $window.location.href = $window.location.href.substring(0, $window.location.href.indexOf('?'));
        });
      } else {
        var authCookie = $cookies.get('auth');
        if (authCookie) {
          if ($window.sessionStorage['stravaToken']) {
            stravaApi.setToken($window.sessionStorage['stravaToken']);
            if ($location.path() === "/") {
              $location.path("/activities");
            } else {
              deferred.resolve();
            }
          } else {
            stravaApi.generateAuthorizationUrl($window.location.href).then(function (url) {
              $window.location.href = url;
            });
          }
        } else if (showPageOnAuthCookieNotFound) {
          deferred.resolve();
        } else {
          stravaApi.generateAuthorizationUrl($window.location.href).then(function (url) {
            $window.location.href = url;
          });
        }
      }
      return deferred.promise;
    };
  };
  
  $routeProvider.when('/', {
    templateUrl: '../views/main.html',
    controller: 'mainController',
    controllerAs: 'main',
    resolve: {
      app: authenticationCheck(true)
    }
  
  }).when('/activities', {
    templateUrl: '../views/activities.html',
    controller: 'activitiesController',
    controllerAs: 'activities',
    resolve: {
      app: authenticationCheck()
    }
  
  }).otherwise({
    redirectTo: '/'
  });
});
