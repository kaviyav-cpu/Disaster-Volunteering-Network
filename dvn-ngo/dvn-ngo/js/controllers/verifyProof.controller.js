/**
 * verifyProof.controller.js
 * -----------------------------------------------------------------
 * Bindings used in partials/verify-proof.html:
 *   - ng-model (two-way) -> each submission's remarks textarea,
 *     one per ng-repeat item (vm.remarksDraft[submission.id])
 */
angular.module('dvnNgo').controller('VerifyProofController', [
  'ProofFactory', 'NgoTaskService',
  function (ProofFactory, NgoTaskService) {
    var vm = this;

    vm.submissions = ProofFactory.getAll();
    vm.remarksDraft = {}; // keyed by submission id, bound via ng-model

    vm.taskTitle = function (taskId) {
      var task = NgoTaskService.getTaskById(taskId);
      return task ? task.title : 'Unknown task';
    };

    vm.verify = function (submission) {
      ProofFactory.verify(submission.id, vm.remarksDraft[submission.id]);
    };
    vm.reject = function (submission) {
      ProofFactory.reject(submission.id, vm.remarksDraft[submission.id]);
    };
  }
]);
