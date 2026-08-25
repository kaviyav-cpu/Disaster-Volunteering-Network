/**
 * manageTasks.controller.js
 * -----------------------------------------------------------------
 * Bindings used in partials/manage-tasks.html:
 *   - ng-model (two-way)  -> search box, filters the ng-repeat live
 *   - One-time binding :: -> task title/location in each row (static
 *     once rendered — only status/volunteer count change, and those
 *     stay normal-bound since they DO update after publish/close)
 */
angular.module('dvnNgo').controller('ManageTasksController', [
  'NgoTaskService',
  function (NgoTaskService) {
    var vm = this;

    vm.tasks = NgoTaskService.getAllTasks();
    vm.searchText = '';

    vm.publish = function (task) {
      NgoTaskService.updateStatus(task.id, 'Published');
    };
    vm.close = function (task) {
      NgoTaskService.updateStatus(task.id, 'Closed');
    };
    vm.remove = function (task) {
      NgoTaskService.deleteTask(task.id);
    };

    vm.statusClass = function (status) {
      if (status === 'Published') { return 'pill pill-approved'; }
      if (status === 'Draft') { return 'pill pill-pending'; }
      return 'pill pill-closed';
    };
  }
]);
