const express = require('express');
const router = express.Router();
const User = require('../models/User');
const SystemLog = require('../models/SystemLog');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/auth');

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, city, registrationNo } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password required' });
    }
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Account with this email already exists' });
    }
    const user = new User({
      name, email: email.toLowerCase(), password, role: role || 'volunteer',
      city: city || 'California, USA', registrationNo: registrationNo || '',
      status: role === 'ngo' ? 'Pending Verification' : 'Active',
      skills: role === 'volunteer' ? ['First Aid', 'Teamwork'] : [],
      badges: ['New Responder']
    });
    await user.save();
    await SystemLog.create({
      event: 'New ' + user.role.toUpperCase() + ' Registered: ' + user.name + ' (' + user.email + ')',
      sourceIp: req.ip || '127.0.0.1', level: 'INFO'
    });
    res.status(201).json({ success: true, message: 'Registration successful', user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required' });
    }
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || user.password !== password) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    if (user.status === 'Suspended') return res.status(403).json({ success:false, message:'Your account is suspended. Contact the administrator.' });
    if (user.role === 'ngo' && user.status !== 'Active') return res.status(403).json({ success:false, message:'NGO account is awaiting administrator verification.' });
    await SystemLog.create({
      event: 'User Login: ' + user.name + ' (' + user.role + ')',
      sourceIp: req.ip || '127.0.0.1', level: 'INFO'
    });
    const token = jwt.sign({ _id: user._id.toString(), email: user.email, name: user.name, role: user.role }, JWT_SECRET, { expiresIn: '8h' });
    res.json({ success: true, message: 'Login successful', user, token });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/users', async (req, res) => {
  try {
    const { role } = req.query;
    const filter = role ? { role } : {};
    const users = await User.find(filter).select('-password');
    res.json({ success: true, count: users.length, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
