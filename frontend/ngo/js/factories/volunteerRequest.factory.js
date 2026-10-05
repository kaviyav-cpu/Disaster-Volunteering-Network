angular.module('dvnNgo').factory('VolunteerRequestFactory', ['$http', function ($http) {
  var user = JSON.parse(localStorage.getItem('dvn_user') || 'null');
  var email = user && user.email ? user.email : '';
  var requests = [];
  var api = {};
  api.refresh = function () { return $http.get('/api/ngo/requests?ngoEmail=' + encodeURIComponent(email)).then(function(r){ requests = r.data.requests || []; return requests; }); };
  api.getAll = function(){ return requests; };
  api.getApproved = function(){ return requests.filter(function(r){return r.status==='Approved';}); };
  api.getPendingCount = function(){ return requests.filter(function(r){return r.status==='Pending';}).length; };
  api.setStatus = function(req,status){ return $http.put('/api/ngo/requests/'+req._id,{status:status,ngoEmail:email}).then(function(r){ req.status=r.data.request.status; return req; }); };
  api.refresh();
  return api;
}]);
