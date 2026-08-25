/**
 * app.module.js
 * -----------------------------------------------------------------
 * This is the NGO team-member's module: 'dvnNgo'.
 *
 * Why a separate module (not just 'dvnAdmin' again)?
 * Your team is splitting Volunteer / NGO / Admin across three
 * people. If each person builds a *sub-module* ('dvnVolunteer',
 * 'dvnNgo', 'dvnAdmin') instead of one shared module, the final
 * integration step is trivial:
 *
 *   angular.module('dvnApp', ['ngRoute', 'dvnVolunteer', 'dvnNgo', 'dvnAdmin']);
 *
 * ...and every controller/service/factory/route from all three
 * people is available with zero renaming or merge conflicts, because
 * each of you owns your own namespace.
 *
 * All routes in this module are prefixed with /ngo/... so they can
 * never collide with the Volunteer or Admin teammates' route paths.
 */
angular.module('dvnNgo', ['ngRoute']);

/**
 * For running THIS module standalone (so you can build/demo it before
 * the other two role-modules exist), index.html declares ng-app on a
 * tiny wrapper module below that just depends on 'dvnNgo'. When the
 * team integrates, delete this wrapper and point ng-app at the real
 * 'dvnApp' module instead — nothing else in this project changes.
 */
angular.module('dvnNgoStandalone', ['dvnNgo']);
