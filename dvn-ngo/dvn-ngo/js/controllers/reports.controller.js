/**
 * reports.controller.js
 * -----------------------------------------------------------------
 * Nothing new is created here — Reports simply re-reads the same
 * services/factories as Dashboard, proving the point that one
 * shared data layer can power multiple views without duplication.
 */
angular.module('dvnNgo').controller('ReportsController', [
  'NgoTaskService', 'VolunteerRequestFactory', 'ProofFactory',
  function (NgoTaskService, VolunteerRequestFactory, ProofFactory) {
    var vm = this;

    vm.summary = NgoTaskService.getSummary();
    vm.approvedVolunteers = VolunteerRequestFactory.getApproved().length;
    vm.pendingRequests = VolunteerRequestFactory.getPendingCount();
    vm.pendingProofs = ProofFactory.getPendingCount();
    vm.verifiedProofs = ProofFactory.getAll().filter(function (p) {
      return p.status === 'Verified';
    }).length;
  }
]);
