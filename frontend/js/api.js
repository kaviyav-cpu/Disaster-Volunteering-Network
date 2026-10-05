/**
 * api.js - Unified Client for Disaster Volunteering Network API
 * Communicates with Node.js backend connected to MongoDB Compass
 */
const API_BASE = window.location.port === '5000' ? '/api' : 'http://localhost:5000/api';

const DvnApi = {
  // Generic fetch wrapper
  async request(endpoint, options = {}) {
    try {
      const res = await fetch(API_BASE + endpoint, {
        headers: {
          'Content-Type': 'application/json',
          ...(DvnAuth.getToken() ? { Authorization: 'Bearer ' + DvnAuth.getToken() } : {}),
          ...(options.headers || {})
        },
        ...options
      });
      const data = await res.json();
      return data;
    } catch (err) {
      console.warn('DVN API fetch fallback/offline mode:', err.message);
      return { success: false, offline: true, error: err.message };
    }
  },

  // Auth
  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  async getUsers(role) {
    return this.request('/auth/users' + (role ? '?role=' + role : ''));
  },

  // Tasks
  async getTasks(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request('/tasks' + (query ? '?' + query : ''));
  },

  async getTask(id) {
    return this.request('/tasks/' + id);
  },

  async createTask(taskData) {
    return this.request('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData)
    });
  },

  async updateTask(id, taskData) {
    return this.request('/tasks/' + id, {
      method: 'PUT',
      body: JSON.stringify(taskData)
    });
  },

  async deleteTask(id) {
    return this.request('/tasks/' + id, { method: 'DELETE' });
  },

  async applyForTask(taskId, application) {
    return this.request('/tasks/' + taskId + '/apply', {
      method: 'POST',
      body: JSON.stringify(application)
    });
  },

  async checkInTask(taskId, volunteerName) {
    return this.request('/tasks/' + taskId + '/checkin', {
      method: 'POST',
      body: JSON.stringify({ volunteerName, volunteerEmail: DvnAuth.getUser()?.email, volunteerId: DvnAuth.getUser()?._id })
    });
  },

  // Volunteer
  async getVolunteerApplications(email) {
    return this.request('/volunteers/applications?email=' + encodeURIComponent(email || ''));
  },
  async getVolunteerHistory(email) {
    return this.request('/volunteers/history?email=' + encodeURIComponent(email || ''));
  },
  async getBadgeEligibility(email) {
    return this.request('/volunteers/badge-eligibility?email=' + encodeURIComponent(email || ''));
  },

  async generateBadge(email) {
    return this.request('/volunteers/badge', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  },

  async getVolunteerProfile(email) {
    return this.request('/volunteers/profile?email=' + encodeURIComponent(email || ''));
  },

  async updateVolunteerProfile(profileData) {
    return this.request('/volunteers/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  },

  async addVolunteerSkill(email, skill) {
    return this.request('/volunteers/skills', {
      method: 'POST',
      body: JSON.stringify({ email, skill })
    });
  },

  async getReminders(email) {
    return this.request('/volunteers/reminders?email=' + encodeURIComponent(email || ''));
  },

  async addReminder(text, userEmail) {
    return this.request('/volunteers/reminders', {
      method: 'POST',
      body: JSON.stringify({ text, userEmail })
    });
  },

  async toggleReminder(id, done) {
    return this.request('/volunteers/reminders/' + id, {
      method: 'PUT',
      body: JSON.stringify({ done })
    });
  },

  async deleteReminder(id) {
    return this.request('/volunteers/reminders/' + id, { method: 'DELETE' });
  },

  async submitProof(proofData) {
    return this.request('/volunteers/proof', {
      method: 'POST',
      body: JSON.stringify(proofData)
    });
  },

  // NGO
  async getNgoSummary(email) {
    return this.request('/ngo/summary?ngoEmail=' + encodeURIComponent(email || ''));
  },

  async getNgoRequests(email) {
    return this.request('/ngo/requests?ngoEmail=' + encodeURIComponent(email || ''));
  },

  async updateNgoRequest(id, status) {
    return this.request('/ngo/requests/' + id, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  },

  async getNgoProofs(email) {
    return this.request('/ngo/proofs?ngoEmail=' + encodeURIComponent(email || ''));
  },

  async updateNgoProof(id, status, adminFeedback) {
    return this.request('/ngo/proofs/' + id, {
      method: 'PUT',
      body: JSON.stringify({ status, adminFeedback })
    });
  },

  async getNgoVolunteers(email) {
    return this.request('/ngo/volunteers?ngoEmail=' + encodeURIComponent(email || ''));
  },

  // Admin
  async getAdminStats() {
    return this.request('/admin/stats');
  },

  async getAdminLogs(search) {
    return this.request('/admin/logs' + (search ? '?search=' + encodeURIComponent(search) : ''));
  },

  async updateUserStatus(userId, status) {
    return this.request('/admin/users/' + userId + '/status', {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  },

  // Broadcast & Highlights
  async getLatestBroadcast() {
    return this.request('/broadcasts/latest');
  },

  async sendBroadcast(title, message, severity) {
    return this.request('/broadcasts', {
      method: 'POST',
      body: JSON.stringify({ title, message, severity })
    });
  },

  async getHighlights() {
    return this.request('/highlights');
  },

  async addHighlight(text) {
    return this.request('/highlights', {
      method: 'POST',
      body: JSON.stringify({ text })
    });
  },

  async deleteHighlight(text) {
    return this.request('/highlights/' + encodeURIComponent(text), { method: 'DELETE' });
  }
};
