/**
 * profile.service.js  ->  NgoProfileService
 * -----------------------------------------------------------------
 * A tiny service (single object, not a list) — shows that .service()
 * works just as well for "one record" as it does for "one collection"
 * (contrast with NgoTaskService above).
 */
angular.module('dvnNgo').service('NgoProfileService', function () {
  var self = this;

  var profile = {
    orgName: 'Red Cross - City Chapter',
    registrationNumber: 'NGO-REG-88213',
    email: 'contact@redcross-city.org',
    phone: '044-2345xxxx',
    address: '12 Relief Avenue, City Center',
    description: 'Coordinating disaster relief, medical camps and food distribution across the district.'
  };

  self.getProfile = function () {
    return profile;
  };

  self.updateProfile = function (updated) {
    angular.extend(profile, updated);
    return profile;
  };
});
