// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('todo', ['ionic'])

.factory('Projects', function(){
  return {
    all: function() {
      console.log('all');
    },
    save: function(projects) {
      console.log('save');
    },
    newProject: function(projects) {
      console.log(newProject);
    },
    getLastActiveIndex: function () {
      console.log('getLastActiveIndex');
    },
    setLastActiveIndex: function (index) {
      console.log('setLastActiveIndex');
    },
  }
})

.controller('TodoCtrl', function ($scope, $ionicModal, $timeout, $ionicSideMenuDelegate, Projects) {

  var createProject = function(projectTitle) {
    var newProject = Projects.newPropject(projectTitle);
    $scope.projects.push(newProject);
    Projects.save($scope.projects);
    $scope.selectProject(newProject, $scope.projects.length-1);
  }

  $scope.projects = Projects.all();
  $scope.activeProject = $scope.projects[Projects.getLastActiveIndex()];

  $scope.newProject = function () {
    var projectTitle = prompt('Project name');
    if(projectTitle) {
      createProject(projectTitle);
    }
  }

  $scope.selectProject = function(project, index) {
    $scope.activeProject = project;
    Project.setLastActiveIndex(index);
    $ionicSideMenuDelegate.toggleLeft(false);
  }

  $ionicModal.fromTemplateUrl('new-task.html', function(modal) {
    $scope.taskModal = modal;
   }, {
     scope: $scope
   });

  //$scope.tasks = [];

  // $ionicModal.fromTemplateUrl('new-task.html', function(modal) {
  //   $scope.taskModal=modal;
  // }, {
  //   scope: $scope,
  //   animation: 'slide-in-up'
  // });

  $scope.createTask = function(task) {
    console.log('createTask');
    $scope.tasks.push({ title: task.title});
    $scope.taskModal.hide();
    task.title="";
  }

  $scope.newTask = function() {
    $scope.taskModal.show();
  }

  $scope.closeNewTask = function() {
    $scope.taskModal.hide();
  }

})

// .run(function($ionicPlatform) {
//   $ionicPlatform.ready(function() {
//     if(window.cordova && window.cordova.plugins.Keyboard) {
//       // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
//       // for form inputs)
//       cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
//
//       // Don't remove this line unless you know what you are doing. It stops the viewport
//       // from snapping when text inputs are focused. Ionic handles this internally for
//       // a much nicer keyboard experience.
//       cordova.plugins.Keyboard.disableScroll(true);
//     }
//     if(window.StatusBar) {
//       StatusBar.styleDefault();
//     }
//   });
// })
