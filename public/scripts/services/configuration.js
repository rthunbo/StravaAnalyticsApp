angular.module('StravaAnalyticsApp').factory('configuration', ['$http', function ($http) {

  'use strict';

  return $http.get('/client-configuration.js').then(function (response) {
    return response.data;
  });
}]);