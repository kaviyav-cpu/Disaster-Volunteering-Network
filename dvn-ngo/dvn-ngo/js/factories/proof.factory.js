/**
 * proof.factory.js  ->  ProofFactory
 * -----------------------------------------------------------------
 * Holds the proof-of-work submissions volunteers upload after a
 * task, and the NGO verifies/rejects here with an optional remark.
 */
angular.module('dvnNgo').factory('ProofFactory', function () {
  var submissions = [
    {
      id: 1, taskId: 1, volunteerName: 'Carlos Diaz',
      description: 'Distributed 40 food kits at the city center shelter, photos attached.',
      submittedDate: '20-07-2026', status: 'Pending', remarks: ''
    },
    {
      id: 2, taskId: 2, volunteerName: 'Ravi Kumar',
      description: 'Assisted medical team with intake for 25 patients.',
      submittedDate: '22-07-2026', status: 'Pending', remarks: ''
    }
  ];

  var ProofFactory = {};

  ProofFactory.getAll = function () {
    return submissions;
  };

  ProofFactory.getPendingCount = function () {
    return submissions.filter(function (p) { return p.status === 'Pending'; }).length;
  };

  ProofFactory.verify = function (id, remarks) {
    var target = null;
    submissions.forEach(function (p) { if (p.id === id) { target = p; } });
    if (target) {
      target.status = 'Verified';
      target.remarks = remarks || 'Looks good.';
    }
    return target;
  };

  ProofFactory.reject = function (id, remarks) {
    var target = null;
    submissions.forEach(function (p) { if (p.id === id) { target = p; } });
    if (target) {
      target.status = 'Rejected';
      target.remarks = remarks || 'Needs resubmission.';
    }
    return target;
  };

  return ProofFactory;
});
