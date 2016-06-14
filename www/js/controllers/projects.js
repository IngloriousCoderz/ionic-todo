angular.module('todo').controller('ProjectsCtrl', function($scope, $rootScope, $timeout, $ionicSideMenuDelegate, $ionicPopup, Projects) {
  $scope.projects = Projects.getProjects();

  $timeout(function() {
    if ($scope.projects.length == 0) {
      $ionicSideMenuDelegate.toggleLeft()
    }
  })

  $scope.doSomething = function () {
    console.log("do something bitch");
  }

  $scope.closePopup = function() {
  // https://github.com/driftyco/ionic/issues/1556
    console.log('close popup');
    if($scope.data.projectName) {
      $scope.popup.close($scope.data.projectName);
    }
  }

  $scope.newProject = function() {
    $scope.data = {}
    $scope.popup = $ionicPopup.show({
      template: '<input type="text"  \
                        ng-model="data.projectName" \
                        autofocus \
                        placeholder="myAwesomeProject" \
                        ng-enter="closePopup()" \
                        >',
                        // ng-keyup="alert($event.keyCode)" \
                        // >',
      title: 'Project name',
      subTitle: 'enter project name',
      scope: $scope,
      buttons: [{
        text: 'cancel',
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
    })

    $scope.popup.then(function(res) {
      console.log(res);
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
          $rootScope.$broadcast('ACTIVE_PROJECT_CHANGED')
        })
      }
    })
  }
})
