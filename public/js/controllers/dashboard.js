'use strict';

/* Controllers */

angular.module('myApp.controllers', ['ngResource'])
  // write Dashboard Ctrl here
  .controller('DashboardCtrl', function($scope, $http, $window){
    $scope.getCSV = function(){
      $window.open('/csv/users'+'?'+'firstName=Brian');
    };
    $http.get('/csv/users',{params:{firstName:'Brian'}})
      .success(function(data){
        console.log(data);
      })
      .error(function(data){
        console.log(err);
      });
  })
  // Discussion Directive Controller
  .controller('TasksDirectiveCtrl', function($scope, $http, profile){
    
    $scope.consultantsList = profile.getConsultants();
    
    console.log($scope.consultantsList);
    
    $scope.viewTask = function(task){
      if($scope.currentTask == task._id){
        $scope.currentTask = 'none';
      } else{
        $scope.currentTask = task._id;
      }
    };
    $scope.includeUrl = function(task){
      if(typeof task.formTemplate == 'undefined'){
        return '/partials/task/'+task._id;
      }
      return '/partials/tasks/'+task.formTemplate;
    };
    
    $scope.completeTask = function(task){
      var username = profile.getUser().userName;
      task.completed = new Date();
      task.updatedBy = username;
      var taskIndex = $scope.tasklist.indexOf(task);
      $scope.client.completedTasks.unshift($scope.tasklist.splice(taskIndex,1)[0]);
      if(task.nextTasks.length > 0){
        $http.get('/api/tasks', {params:task.nextTasks})
          .success(function(data){
            console.log(data.length);
            for(var i =0;i<data.length;i++){
              $scope.client.activeTasks.push(data[i]);
            }
            // console.log($scope.client.activeTasks);
            $scope.currentTask = '';
            updateClient();
          })
          .error(function(data){
            console.log(data);
          });
      }else{
        updateClient();
      }
    };
    
    var updateClient = function(){
      $http.put('/api/clients', $scope.client)
        .success(function(data){
          // console.log(data);
        })
        .error(function(data){
          console.log(data);
        });
    }
  })
  
  .controller('DiscussionCtrl', function($scope, $http){
    $scope.currentTime = new Date();
    
    $scope.$watch('messageIds', function(data){
      if($scope.messageIds){
      $http.get('/api/messages', {params: $scope.messageIds})
        .success(function(data){
          $scope.messages = data;
          // console.log(data);
        })
        .error(function(data){
          console.log(data);
        });
      }
    });
    
    
    $scope.toggleResponses = function(message){
      message.showResponses = message.showResponses?false:true;
    };
    
    $scope.submitResponse = function(message, response, avatar){
      var messageIndex = $scope.messages.indexOf(message);
      message.responses.push({from: $scope.user.userName, content: response, avatar: avatar, date: new Date()});
      $scope.messages[messageIndex].newResponse = '';
      $http.post('/api/messages/' + message._id, message)
        .success(function(data){
          console.log(data);
        })
        .error(function(data){
          console.log(typeof data);
        });
    };
    $scope.removeResponse = function(message, response){
      message.responses.splice(message.responses.indexOf(response),1);
    };
    
  })
  .controller('MainCtrl', function ($scope, $http, $resource, $window, profile) {
    
    $scope.profile = profile.getUser();
    // console.log($scope.profile);
    
    $scope.tools = [
      {title: 'Blueprint', link: 'blueprint'},
      {title: 'Replay', link: 'replay'},
      {title: 'Onboarding', link: 'onboarding'}
    ];
    
    $scope.logout = function(){
      $window.location.href = '/logout';
      $scope.profile = {};
    };
    
    // $http.get('/user')
    //   .success(function(data){
    //     $scope.profile = data;
    //   })
    //   .error(function(data){
    //     console.log(data);
    //   });
    
    // $scope.profile = {
    //   firstName: 'Brian',
    //   lastName: 'Pedersen',
    //   userName: 'bpedersen',
    //   avatar: 'http://i.stack.imgur.com/zgwEB.jpg?s=32&g=1',
    //   messages: [{
    //         "from": "Felix Flavius",
    //         "avatar": "http://gravatar.com/avatar/8d0662182931f2b97a4b58feffbf067e.png?s=64&d=http%3A%2F%2Frailscasts.com%2Fassets%2Fguest.png",
    //         "content": "This is the first message. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    //         "responses": []
    //     },
    //     {
    //       "from": "No Body in Particular",
    //       "avatar": "http://gravatar.com/avatar/8d0662182931f2b97a4b58feffbf067e.png?s=64&d=http%3A%2F%2Frailscasts.com%2Fassets%2Fguest.png",
    //       "content": "Trying out this with a new thing some time exclaim dave mathews band underwear, under where?",
    //       "responses": []
    //     }]
    // };
    
    
    $scope.get = function(){
      $http.get('/api/users', {params: {firstName: 'Brian'}})
        .success(function(data){
          console.log(data);
        })
        .error(function(data){
          console.log(data);
        });
    };
    $scope.post = function(){
      $http.post('/api/users', {lastName: 'New'} ,{params: {firstName: 'Steve'}})
        .success(function(data){
          console.log(data);
        })
        .error(function(data){
          console.log(data);
        });
    };
    $scope.put = function(){
      $http({method: 'PUT', url: '/api/passwordResets', params:{firstName: 'Steve'}})
        .success(function(data){
          console.log(data);
        })
        .error(function(data){
          console.log(data);
        });
    };
    $scope.delete = function(){
      $http({method: 'DELETE', url: '/api/passwordResets', params:{firstName: 'Steve'}})
        .success(function(data){
          console.log(data);
        })
        .error(function(data){
          console.log(data);
        });
    };
  });
