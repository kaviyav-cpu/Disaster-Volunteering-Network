/**
 * profile.controller.js
 * -----------------------------------------------------------------
 * vm.form is a WORKING COPY (angular.copy) of the saved profile, so
 * edits in the inputs don't touch the real service data until Save
 * is clicked — Cancel just re-copies from the service, discarding
 * changes. Common pattern for any "edit profile" style page.
 */
angular.module('dvnNgo').controller('NgoProfileController', [
  'NgoProfileService',
  function (NgoProfileService) {
    var vm = this;

    vm.saved = NgoProfileService.getProfile();
    vm.form = angular.copy(vm.saved);
    vm.editing = false;
    vm.savedMessage = '';

    vm.edit = function () {
      vm.form = angular.copy(vm.saved);
      vm.editing = true;
      vm.savedMessage = '';
    };

    vm.cancel = function () {
      vm.form = angular.copy(vm.saved);
      vm.editing = false;
    };

    vm.save = function () {
      vm.saved = NgoProfileService.updateProfile(vm.form);
      vm.editing = false;
      vm.savedMessage = 'Profile updated.';
    };
  }
]);
