angular.module('todo').controller('TasksCtrl', function($scope, $ionicPopup, $ionicListDelegate, $ionicModal, $ionicSideMenuDelegate, Projects) {
  $scope.activeProject = Projects.getActiveProject()

  $scope.$on('ACTIVE_PROJECT_CHANGED', function() {
    $scope.activeProject = Projects.getActiveProject()
  })

  // Create our modal
  $ionicModal.fromTemplateUrl('new-task.html', function(modal) {
    $scope.taskModal = modal
  }, {
    scope: $scope
  })

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
  }

  $scope.closeNewTask = function() {
    $scope.taskModal.hide()
  }

  $scope.createTask = function(task) {
    if (!$scope.activeProject || !task) {
      return
    }
    Projects.createTask(task)
    $scope.activeProject = Projects.getActiveProject()
    $scope.taskModal.hide()
    task.title = ""
  }

  $scope.editTask = function(task, index) {
    $scope.data = {
      title: task.title
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
            e.preventDefault()
          } else {
            return $scope.data.title
          }
        }
      }]
    }).then(function(res) {
      if (res) {
        Projects.updateTask(res, index)
        $scope.activeProject = Projects.getActiveProject()
        $ionicListDelegate.closeOptionButtons()
      }
    })
  }

  $scope.moveTask = function(task, fromIndex, toIndex) {
    Projects.moveTask(task, fromIndex, toIndex)
    $scope.activeProject = Projects.getActiveProject()
  }

  $scope.removeTask = function(index) {
    Projects.removeTask(index)
    $scope.activeProject = Projects.getActiveProject()
  }

  $scope.toggleProjects = function() {
    $ionicSideMenuDelegate.toggleLeft()
  }
})
