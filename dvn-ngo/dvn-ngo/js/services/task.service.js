/**
 * task.service.js  ->  NgoTaskService
 * -----------------------------------------------------------------
 * Single source of truth for every task this NGO has created.
 * Built as a .service() (instantiated with `new`, so `this` becomes
 * the injected object) because it's exactly one thing: "the NGO's
 * task list" — a fixed set of operations against one dataset.
 *
 * Shared by FOUR pages, which is the main "connectivity" story here:
 *   - Create Task        -> calls addTask()
 *   - Manage Tasks        -> calls getAllTasks(), updateStatus(), deleteTask()
 *   - Dashboard            -> calls getSummary() (derived from the same array)
 *   - Reports              -> calls getSummary() + getAllTasks() for breakdowns
 * Because all four inject the same singleton, creating a task on
 * "Create Task" is immediately visible on Dashboard/Reports without
 * any extra wiring.
 */
angular.module('dvnNgo').service('NgoTaskService', function () {
  var self = this;
  var nextId = 4;

  var tasks = [
    {
      id: 1,
      title: 'Food Distribution - City Center',
      description: 'Assist with unloading, sorting and distributing food supplies to affected families at the city center shelter.',
      skillsRequired: ['Physical Fitness', 'Teamwork'],
      location: 'City Center Shelter',
      date: '20-07-2026',
      time: '10:00 AM - 2:00 PM',
      capacity: 15,
      volunteersAssigned: 9,
      status: 'Published'
    },
    {
      id: 2,
      title: 'Medical Camp - Shelter A',
      description: 'Support the on-site medical team with first aid and patient intake.',
      skillsRequired: ['First Aid (Certified)', 'CPR (Certified)'],
      location: 'Shelter A',
      date: '22-07-2026',
      time: '9:00 AM - 1:00 PM',
      capacity: 8,
      volunteersAssigned: 8,
      status: 'Published'
    },
    {
      id: 3,
      title: 'Debris Clearance - Ward 7',
      description: 'Manual debris clearance and access-route restoration after the flood.',
      skillsRequired: ['Physical Fitness'],
      location: 'Ward 7',
      date: '25-07-2026',
      time: '7:00 AM - 12:00 PM',
      capacity: 20,
      volunteersAssigned: 4,
      status: 'Draft'
    }
  ];

  // ---- public API ----
  self.getAllTasks = function () {
    return tasks;
  };

  self.getTaskById = function (id) {
    var numericId = parseInt(id, 10);
    var found = null;
    tasks.forEach(function (t) { if (t.id === numericId) { found = t; } });
    return found;
  };

  self.addTask = function (taskData) {
    var newTask = angular.extend({}, taskData, {
      id: nextId++,
      volunteersAssigned: 0,
      status: 'Draft'
    });
    tasks.unshift(newTask);
    return newTask;
  };

  self.updateStatus = function (id, status) {
    var task = self.getTaskById(id);
    if (task) { task.status = status; }
    return task;
  };

  self.deleteTask = function (id) {
    var numericId = parseInt(id, 10);
    var index = -1;
    tasks.forEach(function (t, i) { if (t.id === numericId) { index = i; } });
    if (index > -1) { tasks.splice(index, 1); }
  };

  // Derived numbers for Dashboard + Reports — kept here (not
  // duplicated in a controller) so both pages always agree.
  self.getSummary = function () {
    var published = tasks.filter(function (t) { return t.status === 'Published'; });
    var draft = tasks.filter(function (t) { return t.status === 'Draft'; });
    var closed = tasks.filter(function (t) { return t.status === 'Closed'; });
    var totalVolunteers = tasks.reduce(function (sum, t) { return sum + t.volunteersAssigned; }, 0);

    return {
      totalTasks: tasks.length,
      publishedTasks: published.length,
      draftTasks: draft.length,
      closedTasks: closed.length,
      totalVolunteersAssigned: totalVolunteers
    };
  };
});
