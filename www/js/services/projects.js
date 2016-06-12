angular.module('todo').factory('Projects', function() {
  var obj = {
    all: function() {
      var projectString = window.localStorage['projects']
      if (projectString) {
        return angular.fromJson(projectString)
      }
      return []
    },

    save: function(projects) {
      window.localStorage['projects'] = angular.toJson(projects)
    },

    newProject: function(projectTitle) {
      // Add a new project
      return {
        title: projectTitle,
        tasks: []
      }
    },

    getActiveProject: function() {
      return obj.all()[obj.getLastActiveIndex()]
    },

    getLastActiveIndex: function() {
      return parseInt(window.localStorage['lastActiveProject']) || 0
    },

    setLastActiveIndex: function(index) {
      window.localStorage['lastActiveProject'] = index
    },

    update: function(projects) {
      // http://stackoverflow.com/questions/18234442/angularjs-from-a-factory-how-can-i-call-another-function
      obj.save(projects)
    },

    deleteTask: function(project, task) {
      console.log(window.localStorage['projects'][project])
    },

    deleteProject: function(project) {
      console.log(window.localStorage['projects'][project])
    },

    resetProjects: function() {
      window.localStorage.removeItem('projects')
      window.localStorage.removeItem('lastActiveProject')
    }
  }

  return obj
})
