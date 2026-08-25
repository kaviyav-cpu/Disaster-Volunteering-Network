angular.module('dvnNgo').controller('ShellController', [
  '$scope', '$location',
  function ($scope, $location) {
    $scope.isActive = function (path) {
      return $location.path() === path;
    };
  }
]);
