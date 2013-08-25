angular.module('myApp', [])
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/login', {templateUrl: '/partials/login', controller: 'LoginCtrl'})
      .when('/recover', {templateUrl: '/partials/recover', controller: 'LoginCtrl'})
      .otherwise({redirectTo: '/recover'});
    $locationProvider.html5Mode(true);
  })
  .controller('LoginCtrl', function($scope, $location, $routeParams){
    console.log($routeParams);
    $scope.view = $routeParams.viewId || 'login';
    
    // $scope.cancelRecover = function(){
    //   $location.path('/login');
    // };
  });