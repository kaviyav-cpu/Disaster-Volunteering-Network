angular.module('dvnNgo').controller('HeaderController', [
  'NotificationFactory',
  function (NotificationFactory) {
    var vm = this;
    vm.user = NotificationFactory.getCurrentUser();
    vm.notifications = NotificationFactory.getAll();
    vm.unreadCount = NotificationFactory.getUnreadCount();
    vm.showDropdown = false;

    vm.toggleNotifications = function () {
      vm.showDropdown = !vm.showDropdown;
      if (vm.showDropdown) {
        NotificationFactory.markAllRead();
        vm.unreadCount = NotificationFactory.getUnreadCount();
      }
    };
  }
]);
