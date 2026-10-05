const express = require('express');
const router = express.Router();
const Highlight = require('../models/Highlight');
const { authenticate, requireRole } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const list = await Highlight.find().sort({ createdAt: -1 });
    res.json({ success: true, highlights: list.map(h => h.text) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ success: false, message: 'Text required' });
    const h = new Highlight({ text });
    await h.save();
    res.status(201).json({ success: true, highlight: h.text });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/:text', authenticate, requireRole('admin'), async (req, res) => {
  try {
    await Highlight.deleteOne({ text: req.params.text });
    res.json({ success: true, message: 'Highlight deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
