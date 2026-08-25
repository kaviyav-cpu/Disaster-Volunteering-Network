/**
 * dashboard.controller.js
 * -----------------------------------------------------------------
 * Deliberately injects THREE different services/factories to show
 * how a dashboard is usually just a read-only aggregation layer over
 * data owned elsewhere — it creates nothing of its own.
 *
 * Bindings used in partials/dashboard.html:
 *   - Interpolation {{ }}  -> stat card numbers
 *   - ng-repeat             -> recent tasks / pending items lists
 *   - ng-class              -> status pill colours
 */
angular.module('dvnNgo').controller('NgoDashboardController', [
  'NgoTaskService', 'VolunteerRequestFactory', 'ProofFactory',
  function (NgoTaskService, VolunteerRequestFactory, ProofFactory) {
    var vm = this;

    vm.summary = NgoTaskService.getSummary();
    vm.pendingRequests = VolunteerRequestFactory.getPendingCount();
    vm.pendingProofs = ProofFactory.getPendingCount();
    vm.recentTasks = NgoTaskService.getAllTasks().slice(0, 4);

    vm.statusClass = function (status) {
      if (status === 'Published') { return 'pill pill-approved'; }
      if (status === 'Draft') { return 'pill pill-pending'; }
      return 'pill pill-closed';
    };
  }
]);
