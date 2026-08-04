// ============================================================
// MODULE
// Every AngularJS app needs exactly one root module.
// All value/service/filter/controller pieces below are
// registered onto this same module: dvnApp
// ============================================================
var dvnApp = angular.module('dvnApp', []);

// ============================================================
// VALUE BINDING
// .value() registers a plain injectable object/constant.
// Use it for simple config that controllers/services can ask for.
// ============================================================
dvnApp.value('appConfig', {
  appName: 'Disaster Volunteering Network Project',
  year: 2026,
  minHours: 1,
  maxHours: 12
});

// ============================================================
// SERVICES
// .service() registers a reusable class-like object for
// business logic / shared data, injected wherever it's needed.
// ============================================================
dvnApp.service('TaskService', function () {

  var upcomingTasks = [
    {
      title: 'Flood Relief Food Distribution',
      dateLabel: 'Aug 15, 2026 - 09:00 AM',
      status: 'Confirmed'
    }
  ];

  var broadcastMessage = 'Listen to the latest audio warning and crisis updates broadcasted across network hubs.';

  this.getUpcomingTasks = function () {
    return upcomingTasks;
  };

  this.checkIn = function (task) {
    task.status = 'Checked In';
  };

  this.getBroadcastMessage = function () {
    return broadcastMessage;
  };
});

dvnApp.service('AuthService', function () {
  this.roles = ['volunteer', 'NGO'];

  // Placeholder for a real backend call (e.g. via $http)
  this.register = function (user) {
    console.log('Registering user:', user);
    return true;
  };
});

// ============================================================
// FILTERS
// Custom filters transform values inside {{ }} bindings,
// e.g. {{ hours | hoursLabel }}
// ============================================================
dvnApp.filter('hoursLabel', function () {
  return function (input) {
    if (input == 1) {
      return input + ' hour';
    }
    return input + ' hours';
  };
});

dvnApp.filter('capitalize', function () {
  return function (input) {
    if (!input) return '';
    return input.charAt(0).toUpperCase() + input.slice(1);
  };
});

// ============================================================
// CONTROLLERS
// One controller per page/view, attached via ng-controller.
// ============================================================

// ---- home.html ----
dvnApp.controller('HomeController', ['$scope', 'appConfig', 'TaskService',
  function ($scope, appConfig, TaskService) {
    $scope.appName = appConfig.appName;
    $scope.year = appConfig.year;
    $scope.broadcastMessage = TaskService.getBroadcastMessage();

    $scope.playAudio = function () {
      var audio = document.getElementById('homeAudio');
      if (audio) audio.play();
    };

    $scope.pauseAudio = function () {
      var audio = document.getElementById('homeAudio');
      if (audio) audio.pause();
    };
  }]);

// ---- register.html ----
dvnApp.controller('RegisterController', ['$scope', 'appConfig', 'TaskService', 'AuthService',
  function ($scope, appConfig, TaskService, AuthService) {
    // This single object is what powers two-way binding:
    // every ng-model="user.xxx" field below reads AND writes here.
    $scope.user = {
      role: 'volunteer',
      fullname: '',
      registrationNo: '',
      email: '',
      city: '',
      password: ''
    };
   
    $scope.appName = appConfig.appName;
    $scope.year = appConfig.year;

    $scope.isNgo = function () {
      return $scope.user.role === 'NGO';
    };

    $scope.submitRegistration = function () {
      AuthService.register($scope.user);
      alert('Registration successful! Please login.');
      window.location.href = 'login.html';
    };
  }]);

// ---- volunteer-dashboard.html ----
dvnApp.controller('VolunteerDashboardController', ['$scope', '$interval', 'appConfig', 'TaskService',
  function ($scope, $interval, appConfig, TaskService) {
    $scope.volunteerName = 'Kaviya';
    $scope.liveClock = '';
    $scope.tasks = TaskService.getUpcomingTasks();
    $scope.hourProgress = 18;
    $scope.hourGoal = 25;
    $scope.reliability = 0.95;
    $scope.appName = appConfig.appName;
    $scope.year = appConfig.year;
    function updateClock() {
      $scope.liveClock = new Date().toLocaleTimeString();
    }
    updateClock();
    $interval(updateClock, 1000);

    $scope.checkInTask = function (task) {
      TaskService.checkIn(task);
      alert('Checked into ' + task.title + ' successfully!');
    };

    $scope.triggerAlert = function () {
      var audio = document.getElementById('sirenAudio');
      if (audio) audio.play();
      alert('SOS Broadcasted to local crisis coordinator!');
    };
  }]);

// ---- upload-proof.html ----
dvnApp.controller('UploadProofController', ['$scope', 'appConfig', 'TaskService',
  function ($scope, appConfig, TaskService) {
    $scope.minHours = appConfig.minHours;
    $scope.maxHours = appConfig.maxHours;
    $scope.hours = 4;          // two-way bound to the range slider
    $scope.imagePreview = null;
    $scope.appName = appConfig.appName;
    $scope.year = appConfig.year;
    $scope.previewImage = function (event) {
      var file = event.target.files && event.target.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function () {
        // File reader callbacks run outside Angular's digest cycle,
        // so $apply is needed to push the result into the view.
        $scope.$apply(function () {
          $scope.imagePreview = reader.result;
        });
      };
      reader.readAsDataURL(file);
    };

    $scope.submitProof = function () {
      alert('Verification proof submitted to coordinator! Hours claimed: ' + $scope.hours);
      window.location.href = 'volunteer-dashboard.html';
    };
  }]);
