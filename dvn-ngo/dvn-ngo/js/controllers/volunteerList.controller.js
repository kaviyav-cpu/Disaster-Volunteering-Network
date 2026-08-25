/**
 * volunteerList.controller.js
 * -----------------------------------------------------------------
 * This page has NO data of its own — it's entirely derived from
 * VolunteerRequestFactory's approved requests, grouped by name. This
 * is the clearest "connectivity" example in the NGO section: approve
 * someone on Volunteer Requests and they appear here immediately.
 */
angular.module('dvnNgo').controller('VolunteerListController', [
  'VolunteerRequestFactory',
  function (VolunteerRequestFactory) {
    var vm = this;

    var approved = VolunteerRequestFactory.getApproved();

    // group approved requests by volunteer name into a simple roster
    var roster = {};
    approved.forEach(function (r) {
      if (!roster[r.volunteerName]) {
        roster[r.volunteerName] = { name: r.volunteerName, skills: [], tasksCount: 0 };
      }
      roster[r.volunteerName].skills.push(r.skill);
      roster[r.volunteerName].tasksCount++;
    });

    vm.volunteers = Object.keys(roster).map(function (name) { return roster[name]; });
    vm.searchText = '';
  }
]);
