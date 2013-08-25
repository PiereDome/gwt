'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', []).
  value('version', '0.1')
  .factory('profile', function($http){
    var user = '';
    var consultants = [];
    $http.get('/user')
      .then(function(res){
        user = res.data;
      }, function(res){
        return res.data;
      });
    $http.get('/api/users',{params:{dept:'PC'},cache:true})
      .success(function(data){
        if(data.length) {
          while(data.length > 0){
            consultants.push(data.pop());
          }
        } else {
          consultants = [data];
        }
      })
      .error(function(data){
        return data;
      });
    return {
      getUser: function(){
        return user;
      },
      getConsultants: function(){
        return consultants;
      }
    };
  })
  .factory('socket', function ($rootScope) {
  var socket = io.connect();
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {  
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
});;
