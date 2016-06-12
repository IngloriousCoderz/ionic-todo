angular.module('todo').controller('ProjectsCtrl', function($scope, $rootScope, $timeout, $ionicSideMenuDelegate, $ionicPopup, Projects) {
  $scope.projects = Projects.all();

  $scope.activeProject = Projects.getActiveProject()

  $timeout(function() {
    if ($scope.projects.length == 0) {
      $ionicSideMenuDelegate.toggleLeft()
    }
  })

  $scope.newProject = function() {
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
            e.preventDefault()
          } else {
            return $scope.data.projectName
          }
        }
      }]
    }).then(function(res) {
      if (res) {
        createProject(res)
      }
    })
  }

  $scope.selectProject = function(project, index) {
    $scope.activeProject = project
    Projects.setLastActiveIndex(index)
    $ionicSideMenuDelegate.toggleLeft(false)
    $rootScope.$broadcast('ACTIVE_PROJECT_CHANGED')
  }

  $scope.resetProjects = function() {
    $ionicPopup.confirm({
      title: "confirm reset",
      template: "Are you sure you want to reset ALL projects?"
    }).then(function(res) {
      if (res) {
        $timeout(function() {
          $scope.projects = []
          $scope.activeProject = null
          Projects.resetProjects()
        })
      }
    })
  }

  function createProject(projectTitle) {
    var newProject = Projects.newProject(projectTitle);
    $scope.projects.push(newProject);
    Projects.save($scope.projects);
    $scope.selectProject(newProject, $scope.projects.length - 1);
  }
})
