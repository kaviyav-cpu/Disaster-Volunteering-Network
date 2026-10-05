angular.module('dvnNgo').factory('ProofFactory', ['$http', function ($http) {
  var user = JSON.parse(localStorage.getItem('dvn_user') || 'null');
  var email = user && user.email ? user.email : '';
  var submissions = [];
  var api = {};
  api.refresh = function(){ return $http.get('/api/ngo/proofs?ngoEmail='+encodeURIComponent(email)).then(function(r){ submissions=r.data.proofs||[]; return submissions; }); };
  api.getAll=function(){return submissions;};
  api.getPendingCount=function(){return submissions.filter(function(p){return p.status==='Pending';}).length;};
  api.verify=function(p,remarks){return $http.put('/api/ngo/proofs/'+p._id,{status:'Approved',adminFeedback:remarks||'',ngoEmail:email}).then(function(r){angular.copy(r.data.proof,p);return p;});};
  api.reject=function(p,remarks){return $http.put('/api/ngo/proofs/'+p._id,{status:'Rejected',adminFeedback:remarks||'',ngoEmail:email}).then(function(r){angular.copy(r.data.proof,p);return p;});};
  api.refresh();
  return api;
}]);
