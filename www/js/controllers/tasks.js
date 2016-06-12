angular.module('todo').controller('TasksCtrl', function($scope, $ionicPopup, $ionicListDelegate, $ionicSideMenuDelegate, Projects) {
  $scope.activeProject = Projects.getActiveProject()

  $scope.$on('ACTIVE_PROJECT_CHANGED', function() {
    $scope.activeProject = Projects.getActiveProject()
  })

  $scope.createTask = function(task) {
    if (!$scope.activeProject || !task) {
      return
    }
    $scope.activeProject.tasks.push({
      title: task.title
    });
    $scope.taskModal.hide()

    // Inefficient, but save all the projects
    Projects.save($scope.projects)

    task.title = ""
  }

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
    $scope.activeProject.tasks.splice(fromIndex, 1)
    $scope.activeProject.tasks.splice(toIndex, 0, task)
    Projects.save($scope.projects)
  }

  $scope.removeTask = function(index) {
    $scope.activeProject.tasks.splice(index, 1)
    Projects.save($scope.projects)
  }

  $scope.newTask = function() {
    if (!$scope.activeProject) {
      $scope.toggleProjects()
      $ionicPopup.alert({
        title: "No current Project",
        template: "Please create a project first"
      })
      return
    }
    $scope.taskModal.show()
  };

  $scope.closeNewTask = function() {
    $scope.taskModal.hide()
  }

  $scope.toggleProjects = function() {
    $ionicSideMenuDelegate.toggleLeft()
  }
})
