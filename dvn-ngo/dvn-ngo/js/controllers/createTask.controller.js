/**
 * createTask.controller.js
 * -----------------------------------------------------------------
 * The clearest two-way-binding use case in the whole project: every
 * field in the Create Task form is ng-model bound to vm.newTask.*,
 * and the form's built-in $valid state (via name="taskForm") drives
 * ng-disabled on the submit button — no manual validation JS needed.
 */
angular.module('dvnNgo').controller('CreateTaskController', [
  '$location', 'NgoTaskService',
  function ($location, NgoTaskService) {
    var vm = this;

    // Bound two-way to every input in partials/create-task.html
    vm.newTask = {
      title: '',
      description: '',
      skillsRequired: '',
      location: '',
      date: '',
      time: '',
      capacity: null
    };

    vm.submitted = false;

    vm.createTask = function (taskForm) {
      if (taskForm.$invalid) {
        vm.submitted = true; // triggers ng-show error hints without blocking re-typing
        return;
      }
      var payload = angular.copy(vm.newTask);
      payload.skillsRequired = payload.skillsRequired
        .split(',')
        .map(function (s) { return s.trim(); })
        .filter(function (s) { return s.length; });

      NgoTaskService.addTask(payload);
      $location.path('/ngo/manage-tasks'); // hand off to the next page in the flow
    };
  }
]);
