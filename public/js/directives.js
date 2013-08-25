'use strict';

/* Directives */

angular.module('myApp.directives', []).
  directive('appVersion', function (version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  })
  
  .directive('dateFix', function(){
    return {
      restrict: 'C',
      require: 'ngModel',
      link: function(scope, elem, attr, ngModel){
        scope.$apply(function(){
          ngModel.$setViewValue(elem.val());
        });
      }
    };
  })
  
  .directive('leftMenu', function(){
    var directiveObj = {
      templateUrl: 'partials/templates/leftMenu',
      replace: true,
      restrict: 'E'
    };
    return directiveObj;
  })
  
  .directive('discussions', function(){
    var directiveObj = {
      templateUrl: 'partials/directives/discussions',
      replace: true,
      restrict: 'E',
      scope: {user:'=',messageIds:'=messages'},
      controller: 'DiscussionCtrl'
    };
    return directiveObj;
  })
  
  .directive('tasklist', function(){
    return {
      templateUrl: 'partials/directives/tasklist',
      replace: true,
      retrict: 'E',
      scope: {tasklist:'=',client:'='},
      controller: 'TasksDirectiveCtrl'
    };
  });