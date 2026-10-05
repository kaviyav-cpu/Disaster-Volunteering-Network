const mongoose = require('mongoose');

const broadcastSchema = new mongoose.Schema({
  title: { type: String, default: 'Crisis Alert' },
  message: { type: String, required: true },
  severity: { type: String, enum: ['CRITICAL', 'HIGH', 'ADVISORY'], default: 'HIGH' },
  audioFile: { type: String, default: 'alexis_gaming_cam-accepter-2-394924.mp3' },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Broadcast', broadcastSchema);
