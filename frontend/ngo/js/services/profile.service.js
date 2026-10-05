angular.module('dvnNgo').service('NgoProfileService', ['$http', function ($http) {
  var self=this, user=JSON.parse(localStorage.getItem('dvn_user')||'null'), email=user&&user.email||'';
  function map(u){return {orgName:u.name,registrationNumber:u.registrationNo,email:u.email,phone:u.phone,address:u.city,description:u.organizationDescription};}
  self.getProfile=function(){return $http.get('/api/ngo/profile?ngoEmail='+encodeURIComponent(email)).then(function(r){return map(r.data.user);});};
  self.updateProfile=function(p){return $http.put('/api/ngo/profile', {email:email,name:p.orgName,registrationNo:p.registrationNumber,phone:p.phone,city:p.address,organizationDescription:p.description}).then(function(r){return map(r.data.user);});};
}]);
