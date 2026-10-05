const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  skillsRequired: [{ type: String }],
  location: { type: String, required: true },
  date: { type: String, default: '2026-08-15' },
  time: { type: String, default: '09:00 AM - 02:00 PM' },
  capacity: { type: Number, default: 10 },
  volunteersAssigned: { type: Number, default: 0 },
  status: { type: String, enum: ['Draft', 'Published', 'Completed', 'Cancelled'], default: 'Published' },
  category: { type: String, default: 'Disaster Relief' },
  matchRating: { type: Number, default: 95 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  ngoName: { type: String, default: 'Disaster Relief Corp' },
  assignedVolunteers: [{
    volunteerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    status: { type: String, default: 'Confirmed' },
    checkedIn: { type: Boolean, default: false },
    checkedInAt: Date
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', taskSchema);
