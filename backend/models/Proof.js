const mongoose = require('mongoose');

const proofSchema = new mongoose.Schema({
  volunteer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  volunteerName: { type: String, required: true },
  task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
  taskTitle: { type: String, required: true },
  hours: { type: Number, required: true, min: 1, max: 24 },
  imageProof: { type: String, default: '' },
  comments: { type: String, default: '' },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  adminFeedback: { type: String, default: '' },
  submittedAt: { type: Date, default: Date.now },
  verifiedAt: { type: Date }
});

module.exports = mongoose.model('Proof', proofSchema);
