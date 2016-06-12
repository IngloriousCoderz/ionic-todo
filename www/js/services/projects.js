angular.module('todo').factory('Projects', function() {
  function getMaxId() {
    return window.localStorage.getItem('maxId') || 0
  }

  function incrementMaxId() {
    var id = getMaxId()
    window.localStorage.setItem('maxId', ++id)
  }

  function getActiveProject() {
    return getProjects()[getActiveProjectIndex()]
  }

  function getProjects() {
    var projects = window.localStorage.getItem('projects')
    if (projects) {
      return angular.fromJson(projects)
    }
    return []
  }

  function setProjects(projects) {
    window.localStorage.setItem('projects', angular.toJson(projects))
  }

  function getActiveProjectIndex() {
    return parseInt(window.localStorage.getItem('activeProject')) || 0
  }

  function setActiveProjectIndex(index) {
    window.localStorage.setItem('activeProject', index)
  }

  function createProject(title) {
    var project = {
      title: title,
      tasks: []
    }

    var projects = getProjects()
    projects.push(project)
    setActiveProjectIndex(projects.length - 1)
    setProjects(projects)
  }

  function removeProject(index) {
    var projects = getProjects()
    projects.splice(index, 1)
    setProjects(projects)
  }

  function createTask(task) {
    var projects = getProjects()
    var activeProject = projects[getActiveProjectIndex()]
    incrementMaxId()
    task.id = getMaxId()
    activeProject.tasks.push(task)
    setProjects(projects)
  }

  function updateTask(title, index) {
    var projects = getProjects()
    var activeProject = projects[getActiveProjectIndex()]
    activeProject.tasks[index].title = title
    setProjects(projects)
  }

  function moveTask(task, fromIndex, toIndex) {
    var projects = getProjects()
    var activeProject = projects[getActiveProjectIndex()]
    activeProject.tasks.splice(fromIndex, 1)
    activeProject.tasks.splice(toIndex, 0, task)
    setProjects(projects)
  }

  function removeTask(index) {
    var projects = getProjects()
    var activeProject = projects[getActiveProjectIndex()]
    activeProject.tasks.splice(index, 1)
    setProjects(projects)
  }

  function removeAll() {
    window.localStorage.removeItem('projects')
    window.localStorage.removeItem('activeProject')
  }

  return {
    getActiveProject: getActiveProject,
    getActiveProjectIndex: getActiveProjectIndex,
    setActiveProjectIndex: setActiveProjectIndex,
    getProjects: getProjects,
    createProject: createProject,
    removeProject: removeProject,
    createTask: createTask,
    updateTask: updateTask,
    moveTask: moveTask,
    removeTask: removeTask,
    removeAll: removeAll
  }
})
