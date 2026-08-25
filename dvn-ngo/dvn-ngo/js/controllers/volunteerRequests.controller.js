/**
 * volunteerRequests.controller.js
 * -----------------------------------------------------------------
 * Approving here is what populates the Volunteer List page — both
 * controllers read VolunteerRequestFactory's same underlying array.
 */
angular.module('dvnNgo').controller('VolunteerRequestsController', [
  'VolunteerRequestFactory', 'NgoTaskService',
  function (VolunteerRequestFactory, NgoTaskService) {
    var vm = this;

    vm.requests = VolunteerRequestFactory.getAll();

    // small lookup so the template can show a task title, not just an id
    vm.taskTitle = function (taskId) {
      var task = NgoTaskService.getTaskById(taskId);
      return task ? task.title : 'Unknown task';
    };

    vm.approve = function (req) {
      VolunteerRequestFactory.setStatus(req.id, 'Approved');
    };
    vm.reject = function (req) {
      VolunteerRequestFactory.setStatus(req.id, 'Rejected');
    };
  }
]);
