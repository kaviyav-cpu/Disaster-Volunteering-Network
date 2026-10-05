const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['volunteer', 'ngo', 'admin'], default: 'volunteer' },
  city: { type: String, default: 'Chennai, India' },
  phone: { type: String, default: '' },
  registrationNo: { type: String, default: '' },
  status: { type: String, enum: ['Active', 'Pending Verification', 'Suspended'], default: 'Active' },
  skills: [{ type: String }],
  experience: { type: String, default: '' },
  hoursVolunteered: { type: Number, default: 0 },
  monthlyHoursGoal: { type: Number, default: 25 },
  points: { type: Number, default: 100 },
  reliability: { type: Number, default: 0.95 },
  badges: [{ type: String }],
  organizationDescription: { type: String, default: '' },
  contactPerson: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
