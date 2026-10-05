angular.module('dvnNgo').service('NgoTaskService', ['$http', '$q', function ($http, $q) {
  var self = this;
  var user = JSON.parse(localStorage.getItem('dvn_user') || 'null');
  var email = user && user.email ? user.email : '';
  var tasks = [];

  self.refresh = function () {
    return $http.get('/api/tasks?ngoEmail=' + encodeURIComponent(email)).then(function (r) {
      tasks = r.data.tasks || [];
      return tasks;
    });
  };
  self.getAllTasks = function () { return tasks; };
  self.getTaskById = function (id) { return tasks.find(function (t) { return String(t._id) === String(id); }); };
  self.addTask = function (data) {
    data.ngoEmail = email;
    data.ngoName = user.name;
    data.status = 'Published';
    return $http.post('/api/tasks', data).then(function (r) { tasks.unshift(r.data.task); return r.data.task; });
  };
  self.updateStatus = function (task, status) {
    return $http.put('/api/tasks/' + task._id, { status: status }).then(function (r) { angular.copy(r.data.task, task); return task; });
  };
  self.deleteTask = function (task) {
    return $http.delete('/api/tasks/' + task._id).then(function () { var i=tasks.indexOf(task); if(i>=0) tasks.splice(i,1); });
  };
  self.getSummary = function () {
    return $http.get('/api/ngo/summary?ngoEmail=' + encodeURIComponent(email)).then(function (r) { return r.data.summary; });
  };
  self.getEmail = function () { return email; };
  self.refresh();
}]);
