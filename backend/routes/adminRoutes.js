const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Task = require('../models/Task');
const SystemLog = require('../models/SystemLog');
const Proof = require('../models/Proof');

router.get('/stats', async (req, res) => {
  try {
    const totalVolunteers = await User.countDocuments({ role: 'volunteer' });
    const registeredNgos = await User.countDocuments({ role: 'ngo' });
    const activeTasks = await Task.countDocuments({ status: 'Published' });
    const verifiedProofs = await Proof.find({ status: 'Approved' });
    const totalVerifiedHours = verifiedProofs.reduce((sum, p) => sum + (p.hours || 0), 0);
    res.json({
      success: true,
      stats: {
        totalVolunteers,
        registeredNgos,
        activeTasks,
        totalVerifiedHours,
        systemStatus: 'ALL ONLINE'
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/logs', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query.event = { $regex: search, $options: 'i' };
    }
    const logs = await SystemLog.find(query).sort({ timestamp: -1 }).limit(100);
    res.json({ success: true, count: logs.length, logs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/logs', async (req, res) => {
  try {
    const { event, level } = req.body;
    const log = new SystemLog({
      event,
      sourceIp: req.ip || '127.0.0.1',
      level: level || 'INFO'
    });
    await log.save();
    res.status(201).json({ success: true, log });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/users/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { status }, { new: true });
    await SystemLog.create({
      event: 'Admin changed user status: ' + (user ? user.name : '') + ' -> ' + status,
      sourceIp: req.ip || '127.0.0.1',
      level: 'AUDIT'
    });
    res.json({ success: true, message: 'User status updated', user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
