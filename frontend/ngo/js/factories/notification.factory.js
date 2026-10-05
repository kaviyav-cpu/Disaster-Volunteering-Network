/**
 * notification.factory.js
 * -----------------------------------------------------------------
 * Same pattern as the admin build's header notifications: one shared
 * factory backing the bell icon on every NGO page. Other pages call
 * addNotification() when something happens that the NGO should see
 * (e.g. VerifyProofController could call this when a new submission
 * arrives) — none of that requires touching HeaderController.
 */
angular.module('dvnNgo').factory('NotificationFactory', function () {
  var notifications = [
    { id: 1, message: '2 new volunteer requests received', read: false },
    { id: 2, message: '1 proof submission awaiting verification', read: false }
  ];

  var currentUser = { initial: 'R', name: 'Red Cross - City Chapter' };

  return {
    getAll: function () { return notifications; },
    getUnreadCount: function () {
      return notifications.filter(function (n) { return !n.read; }).length;
    },
    markAllRead: function () {
      notifications.forEach(function (n) { n.read = true; });
    },
    addNotification: function (message) {
      notifications.unshift({ id: Date.now(), message: message, read: false });
    },
    getCurrentUser: function () { return currentUser; }
  };
});
