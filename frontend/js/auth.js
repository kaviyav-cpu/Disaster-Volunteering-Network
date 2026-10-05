/**
 * auth.js - Session & Role Management
 */
const DvnAuth = {
  getUser() {
    try {
      const user = localStorage.getItem('dvn_user');
      return user ? JSON.parse(user) : null;
    } catch (e) {
      return null;
    }
  },

  setUser(user) {
    localStorage.setItem('dvn_user', JSON.stringify(user));
    localStorage.setItem('userName', user.name || '');
    localStorage.setItem('userEmail', user.email || '');
    localStorage.setItem('userRole', user.role || '');
  },

  getToken() {
    return localStorage.getItem('dvn_token') || '';
  },

  setToken(token) {
    if (token) localStorage.setItem('dvn_token', token);
    else localStorage.removeItem('dvn_token');
  },

  logout() {
    localStorage.removeItem('dvn_user');
    localStorage.removeItem('dvn_token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    window.location.href = '/login.html';
  },

  isLoggedIn() {
    return !!this.getUser();
  },

  requireRole(role) {
    const user = this.getUser();
    if (!user || user.role !== role) { window.location.href = '/login.html'; return false; }
    return true;
  },

  getRole() {
    const user = this.getUser();
    return user ? user.role : null;
  },

  showToast(msg) {
    let toast = document.getElementById('toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      document.body.appendChild(toast);
    }
    toast.innerText = msg;
    toast.className = 'show';
    setTimeout(() => { toast.className = ''; }, 3000);
  }
};
