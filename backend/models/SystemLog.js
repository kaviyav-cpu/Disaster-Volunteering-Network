const mongoose = require('mongoose');

const systemLogSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  event: { type: String, required: true },
  sourceIp: { type: String, default: '127.0.0.1' },
  level: { type: String, enum: ['INFO', 'WARN', 'CRITICAL', 'AUDIT'], default: 'INFO' }
});

module.exports = mongoose.model('SystemLog', systemLogSchema);
