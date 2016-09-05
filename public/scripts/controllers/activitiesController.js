angular.module('StravaAnalyticsApp').controller('activitiesController', ['$scope', 'stravaApi', function ($scope, stravaApi) {

  'use strict';

  stravaApi.getActivities().then(function (activities) {
    $scope.activities = activities;
  });

}]);
