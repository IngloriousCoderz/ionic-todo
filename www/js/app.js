// Ionic Starter App


// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('todo', ['ionic'])

.factory('Projects', function() {
  var obj = {
    all: function() {
      var projectString = window.localStorage['projects'];
      if (projectString) {
        return angular.fromJson(projectString);
      }
      return [];
    },
    save: function(projects) {
      window.localStorage['projects'] = angular.toJson(projects);
    },
    newProject: function(projectTitle) {
      // Add a new project
      return {
        title: projectTitle,
        tasks: []
      };
    },
    getLastActiveIndex: function() {
      return parseInt(window.localStorage['lastActiveProject']) || 0;
    },
    setLastActiveIndex: function(index) {
      window.localStorage['lastActiveProject'] = index;
    },
    update: function(projects) {
      // http://stackoverflow.com/questions/18234442/angularjs-from-a-factory-how-can-i-call-another-function
      obj.save(projects);
    },
    deleteTask: function(project, task) {
      console.log(window.localStorage['projects'][project]);
    },
    deleteProject: function(project) {
      console.log(window.localStorage['projects'][project]);
    },
    resetProjects: function() {
      window.localStorage.removeItem('projects');
      window.localStorage.removeItem('lastActiveProject');
    }
  }

  return obj;
})

.controller('TodoCtrl', function(
  $scope,
  $ionicModal,
  $ionicPopup,
  $timeout,
  $ionicSideMenuDelegate,
  $ionicListDelegate,
  Projects
) {
  $scope.showDelete = false
  $scope.showReorder = false

  // A utility function for creating a new project
  // with the given projectTitle
  var createProject = function(projectTitle) {
    var newProject = Projects.newProject(projectTitle);
    $scope.projects.push(newProject);
    Projects.save($scope.projects);
    $scope.selectProject(newProject, $scope.projects.length - 1);
  }


  // Load or initialize projects
  $scope.projects = Projects.all();

  // Grab the last active, or the first project
  $scope.activeProject = $scope.projects[Projects.getLastActiveIndex()];

  // Called to create a new project
  $scope.newProject = function() {
    //var projectTitle = prompt('Project name');

    $scope.data = {}

    $ionicPopup.show({
      template: '<input type="text" ng-model="data.projectName">',
      title: 'Project name',
      subTitle: 'sub title',
      scope: $scope,
      buttons: [{
        text: 'cancel'
      }, {
        text: '<b>save</b>',
        type: 'button-positive',
        onTap: function(e) {
          if (!$scope.data.projectName) {
            e.preventDefault();
          } else {
            return $scope.data.projectName;
          }
        }
      }]
    }).then(function(res) {
      if (res) {
        createProject(res)
      }
    })

    // $ionicPopup.prompt({
    //   title: 'Add project',
    //   template: 'Enter project name',
    //   inputType: 'text',
    //   inputPlaceholder: 'myNewAwesomeProject'
    // }).then(
    //   function(projectTitle) {
    //     console.log(projectTitle);
    //     if (projectTitle && projectTitle != "") {
    //       createProject(projectTitle);
    //     }
    //   }
    // );


  };

  // Called to select the given project
  $scope.selectProject = function(project, index) {
    $scope.activeProject = project;
    Projects.setLastActiveIndex(index);
    $ionicSideMenuDelegate.toggleLeft(false);
  };

  // Create our modal
  $ionicModal.fromTemplateUrl('new-task.html', function(modal) {
    $scope.taskModal = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up',
    focusFirstInput: true
  });

  $scope.createTask = function(task) {
    if (!$scope.activeProject || !task) {
      return;
    }
    $scope.activeProject.tasks.push({
      title: task.title
    });
    $scope.taskModal.hide();

    // Inefficient, but save all the projects
    Projects.save($scope.projects);

    task.title = "";
  };

  $scope.editTask = function(item) {
    $scope.data = {
      title: item.title
    }

    $ionicPopup.show({
      template: '<input type="text" ng-model="data.title">',
      title: 'Edit Task',
      subTitle: 'sub title',
      scope: $scope,
      buttons: [{
        text: 'cancel'
      }, {
        text: '<b>save</b>',
        type: 'button-positive',
        onTap: function(e) {
          if (!$scope.data.title) {
            e.preventDefault();
          } else {
            return $scope.data.title;
          }
        }
      }]
    }).then(function(res) {
      if (res) {
        item.title = res
        Projects.save($scope.projects)
        $ionicListDelegate.closeOptionButtons()
      }
    })
  };

  $scope.moveTask = function(task, fromIndex, toIndex) {
    $scope.activeProject.tasks.splice(fromIndex, 1);
    $scope.activeProject.tasks.splice(toIndex, 0, task);
  };

  $scope.removeTask = function(index) {
    $scope.activeProject.tasks.splice(index, 1)
  }

  $scope.newTask = function() {
    if (!$scope.activeProject) {
      $scope.toggleProjects();
      $ionicPopup.alert({
        title: "No current Project",
        template: "Please create a project first"
      });
      return;
    }
    $scope.taskModal.show();
  };

  $scope.closeNewTask = function() {
    $scope.taskModal.hide();
  }

  $scope.toggleProjects = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };

  $scope.resetProjects = function() {
    var confirmPopup = $ionicPopup.confirm({
      title: "confirm reset",
      template: "Are you sure you want to reset ALL projects?"
    });

    confirmPopup.then(function(res) {
      if (res) {
        $timeout(function() {
          $scope.projects = [];
          $scope.activeProject = null;
          Projects.resetProjects();
        });
      }
    });
  };


  // Try to create the first project, make sure to defer
  // this by using $timeout so everything is initialized
  // properly
  // $timeout(function() {
  //   if ($scope.projects.length == 0) {
  //     while (true) {
  //       var projectTitle = prompt('Your first project title:');
  //       if (projectTitle) {
  //         createProject(projectTitle);
  //         break;
  //       }
  //     }
  //   }
  // }, 1000);

  $timeout(function() {
    if ($scope.projects.length == 0) {
      $scope.toggleProjects();
    }
  });
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
