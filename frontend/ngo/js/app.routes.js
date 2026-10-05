/**
 * app.routes.js
 * -----------------------------------------------------------------
 * All 8 NGO pages from the sitemap, namespaced under /ngo/...
 *   /ngo/dashboard
 *   /ngo/create-task
 *   /ngo/manage-tasks
 *   /ngo/volunteer-requests
 *   /ngo/verify-proof
 *   /ngo/volunteer-list
 *   /ngo/reports
 *   /ngo/profile
 *
 * When merged into the team's root app, the Volunteer teammate's
 * routes will live under /volunteer/... and Admin's under /admin/...
 * — so this file can be copy-pasted into a bigger $routeProvider
 * chain with zero edits.
 */
angular.module('dvnNgo').config([
  '$routeProvider',
  function ($routeProvider) {
    $routeProvider
      .when('/ngo/dashboard', {
        templateUrl: 'partials/dashboard.html',
        controller: 'NgoDashboardController',
        controllerAs: 'vm'
      })
      .when('/ngo/create-task', {
        templateUrl: 'partials/create-task.html',
        controller: 'CreateTaskController',
        controllerAs: 'vm'
      })
      .when('/ngo/manage-tasks', {
        templateUrl: 'partials/manage-tasks.html',
        controller: 'ManageTasksController',
        controllerAs: 'vm'
      })
      .when('/ngo/volunteer-requests', {
        templateUrl: 'partials/volunteer-requests.html',
        controller: 'VolunteerRequestsController',
        controllerAs: 'vm'
      })
      .when('/ngo/verify-proof', {
        templateUrl: 'partials/verify-proof.html',
        controller: 'VerifyProofController',
        controllerAs: 'vm'
      })
      .when('/ngo/volunteer-list', {
        templateUrl: 'partials/volunteer-list.html',
        controller: 'VolunteerListController',
        controllerAs: 'vm'
      })
      .when('/ngo/reports', {
        templateUrl: 'partials/reports.html',
        controller: 'ReportsController',
        controllerAs: 'vm'
      })
      .when('/ngo/profile', {
        templateUrl: 'partials/profile.html',
        controller: 'NgoProfileController',
        controllerAs: 'vm'
      })
      .otherwise({ redirectTo: '/ngo/dashboard' });
  }
]);
