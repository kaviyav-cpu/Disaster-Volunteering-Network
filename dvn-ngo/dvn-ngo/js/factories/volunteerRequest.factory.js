/**
 * volunteerRequest.factory.js  ->  VolunteerRequestFactory
 * -----------------------------------------------------------------
 * Factory (not service) so the approve/reject scoring logic can stay
 * as private helpers, and only a clean public object is exposed —
 * same reasoning as VolunteerFactory in the admin build.
 *
 * Connectivity: approving a request here is what makes that
 * volunteer show up on the Volunteer List page (VolunteerListController
 * reads the same 'requests' array, filtered to Approved).
 */
angular.module('dvnNgo').factory('VolunteerRequestFactory', function () {
  var requests = [
    { id: 1, taskId: 1, volunteerName: 'Alice Brown', skill: 'Logistics', appliedDate: '15-07-2026', status: 'Pending' },
    { id: 2, taskId: 2, volunteerName: 'Carlos Diaz', skill: 'First Aid (Certified)', appliedDate: '16-07-2026', status: 'Approved' },
    { id: 3, taskId: 1, volunteerName: 'Fathima Khan', skill: 'Teamwork', appliedDate: '16-07-2026', status: 'Pending' },
    { id: 4, taskId: 2, volunteerName: 'Ravi Kumar', skill: 'CPR (Certified)', appliedDate: '17-07-2026', status: 'Approved' }
  ];

  var VolunteerRequestFactory = {};

  VolunteerRequestFactory.getAll = function () {
    return requests;
  };

  VolunteerRequestFactory.getApproved = function () {
    return requests.filter(function (r) { return r.status === 'Approved'; });
  };

  VolunteerRequestFactory.getPendingCount = function () {
    return requests.filter(function (r) { return r.status === 'Pending'; }).length;
  };

  VolunteerRequestFactory.setStatus = function (id, status) {
    var target = null;
    requests.forEach(function (r) { if (r.id === id) { target = r; } });
    if (target) { target.status = status; }
    return target;
  };

  return VolunteerRequestFactory;
});
