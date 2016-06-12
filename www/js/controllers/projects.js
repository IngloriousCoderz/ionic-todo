angular.module('todo').controller('ProjectsCtrl', function($scope, $rootScope, $timeout, $ionicSideMenuDelegate, $ionicPopup, Projects) {
  $scope.projects = Projects.getProjects();

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
        Projects.createProject(res)
        $scope.projects = Projects.getProjects()
        $scope.selectProject(Projects.getActiveProjectIndex())
      }
    })
  }

  $scope.selectProject = function(index) {
    Projects.setActiveProjectIndex(index)
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
          Projects.removeAll()
          $scope.projects = Projects.getProjects()
        })
      }
    })
  }
})
