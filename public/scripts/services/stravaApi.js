angular.module('StravaAnalyticsApp').factory('stravaApi', ['$http', '$window', 'configuration', function ($http, $window, configuration) {

  'use strict';

  var generateAuthorizationUrl = function(redirectUrl) {
    return configuration.then(function (data) {
      var params = {};
      params['client_id'] = data.stravaApiKey;
      params['scope'] = 'view_private';
      params['redirect_uri'] = redirectUrl;
      params['response_type'] = 'code';
      params['approval_prompt'] = 'auto';
      return 'https://www.strava.com/oauth/authorize?' + $.param(params);
    });
  };
  
  var getToken = function (code) {
    return configuration.then(function (data) {
      var params = {};
      params['client_id'] = data.stravaApiKey;
      params['code'] = code;
      return $http.post('/strava/oauth/token', $.param(params), {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      });
    }).then(function (response) {
      return response.data;
    });
  };
  
  var setToken = function(token) {
    this.token = token;
  };
  
  var getActivities = function () {
    return $http.get('/strava/api/v3/athlete/activities', {
      headers: {'Authorization': 'Bearer ' + this.token},
      params: { page: 1 }
    }).then(function (response) {
      return response.data;
    });
  };
  
  var getActivityData = function (activityId, streamTypes) {
    return $http.get('/strava/api/v3/activities/' + activityId + '/streams/' + streamTypes.join(','), {
      headers: {'Authorization': 'Bearer ' + this.token},
      params: { resolution: 'medium', 'series_type': 'time' }
    }).then(function (response) {
      return response.data;
    });
  };
  
  return {
    generateAuthorizationUrl: generateAuthorizationUrl,
    getToken: getToken,
    setToken: setToken,
    getActivities: getActivities,
    getActivityData: getActivityData
  };
}]);
