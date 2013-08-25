angular.module('myApp.controllers')
  .controller('OnboardingCtrl', function($scope, $http, $location){
    
    $http.get('/api/clients', {params: {onboarding: true}})
      .success(function(data){
          if(typeof data === 'object'){
            $scope.onboardingClients = data.length > 1? data: [data];
          }
      })
      .error(function(data){
        
      });
    
    // $scope.tasks = [{title:'Lead Comes In'},{title:'Company Created in CW'}];
    $scope.viewClient = function(client){
      $location.path('/onboarding/client/'+client._id);
    };
    $scope.completeTask = function(task){
      $http.get('/api/tasks', {params: {title: task.title}})
        .success(function(data){
          $scope.currentTask = data;
        })
        .error(function(data){
          console.log(data);
        });
    };
    $scope.newClient = function(){
      $location.path('/onboarding/new');
    };
  })
  
  
  
  .controller('OnboardingClientCtrl', function($scope, $http, $location, $routeParams, profile){
    
    $scope.view = 'activeTasks';
    $scope.showRemove = false;
    $scope.changeView = function(view){
      $scope.view = view;
    };    
    
    $http.get('/api/clients/' + $routeParams.clientId)
      .success(function(data){
        $scope.client = data;
        $scope.client.messages = ['520859d1e4b0d382204e5ce2'];
      })
      .error(function(data){
        $scope.error = data;
      });
    
    $scope.toggleRemove = function(){
      $scope.showRemove = !$scope.showRemove;
    };
    
    $scope.removeClient = function(client){
      console.log($scope.deleteClientText);
      if($scope.deleteClientText === 'delete'){
        $http.delete('/api/clients/' + $routeParams.clientId)
          .success(function(data){
            $location.path('/onboarding');
          })
          .error(function(data){
            console.log(data);
          });
      }
    };
  })
  
  
  
  .controller('OnboardingNewCtrl', function($scope, $http, $location){
    $scope.client = {
      onboarding:true
    };
    $scope.contactPattern = /^[+]?1?[\-(]?\d{3}[)\-]?\d{3}[\-]?\d{4}$|^\s*[\w\-\+_]+[\.[\w\-\+_]+]*\@[\w\-\+_]+\.[\w\-\+_]+[\.[\w\-\+_]+]*\s*$/;
    $scope.createClient = function(){
      if(!$scope.client.contact.info){
        return;
      }
      var getTask = $http.get('/api/tasks/52027943e4b0210b7c331c73');
      getTask.then(function(res){
        $http.get('/api/tasks', {params:res.data.nextTasks})
          .success(function(data){
            $scope.client.activeTasks = data;
            $http.post('/api/clients', $scope.client)
              .success(function(data){
                // $location.path('/onboarding');
                $location.path('/onboarding/client/'+data._id);
              })
              .error(function(data){
                console.log(data);
              });
          })
          .error(function(data){
            console.log(data);
          });
      });
    };
  });