const mongoose = require('mongoose');

const highlightSchema = new mongoose.Schema({
  text: { type: String, required: true },
  author: { type: String, default: 'Disaster Network Command' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Highlight', highlightSchema);
