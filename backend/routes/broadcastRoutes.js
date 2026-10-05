const express = require('express');
const router = express.Router();
const Broadcast = require('../models/Broadcast');
const SystemLog = require('../models/SystemLog');

router.get('/latest', async (req, res) => {
  try {
    const broadcast = await Broadcast.findOne({ active: true }).sort({ createdAt: -1 });
    res.json({
      success: true,
      broadcast: broadcast || {
        message: 'Listen to the latest audio warning and crisis updates broadcasted across network hubs.',
        severity: 'HIGH',
        audioFile: 'alexis_gaming_cam-accepter-2-394924.mp3'
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, message, severity } = req.body;
    const broadcast = new Broadcast({
      title: title || 'Emergency Crisis Dispatch',
      message,
      severity: severity || 'CRITICAL'
    });
    await broadcast.save();
    await SystemLog.create({
      event: 'EMERGENCY BROADCAST: ' + broadcast.message,
      sourceIp: req.ip || '127.0.0.1',
      level: 'CRITICAL'
    });
    res.status(201).json({ success: true, message: 'Broadcast dispatched to network', broadcast });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
