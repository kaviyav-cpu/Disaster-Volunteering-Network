const mongoose = require('mongoose');

const volunteerRequestSchema = new mongoose.Schema({
  task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
  taskTitle: { type: String, required: true },
  volunteer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  volunteerName: { type: String, required: true },
  volunteerEmail: { type: String },
  skills: [{ type: String }],
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  appliedAt: { type: Date, default: Date.now },
  notes: { type: String, default: '' }
});

module.exports = mongoose.model('VolunteerRequest', volunteerRequestSchema);
