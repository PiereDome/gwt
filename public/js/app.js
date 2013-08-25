'use strict';

// Declare app level module which depends on filters, and services

angular.module('myApp', [
  'myApp.controllers',
  'myApp.filters',
  'myApp.services',
  'myApp.directives'
])
.config(function ($routeProvider, $locationProvider) {
  $routeProvider
    .when('/dashboard', {templateUrl: 'partials/dashboard/index', controller: 'MainCtrl'})
    .when('/onboarding', {templateUrl: 'partials/onboarding/index', controller: 'OnboardingCtrl'})
    .when('/onboarding/new', {templateUrl: 'partials/onboarding/new', controller: 'OnboardingNewCtrl'})
    .when('/onboarding/client/:clientId', {templateUrl: 'partials/onboarding/client', controller: 'OnboardingClientCtrl'})
    .when('/onboarding/client/:clientId/task/:taskId', {templateUrl: 'partials/tasks/task', controller: 'OnboardingClientCtrl'})
    .when('/profile', {templateUrl: 'partials/profile/index', controller: 'ProfileCtrl'})
    .when('/replay', {templateUrl: 'partials/replay/index', controller: 'ReplayCtrl'})
    .when('/servernotes', {templateUrl: 'partials/servernotes/index', controller: 'ServerCtrl'})
    .otherwise({redirectTo: '/dashboard'});
  $locationProvider.html5Mode(true);
});
