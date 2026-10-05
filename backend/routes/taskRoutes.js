const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const VolunteerRequest = require('../models/VolunteerRequest');
const SystemLog = require('../models/SystemLog');
const User = require('../models/User');

router.get('/', async (req, res) => {
  try {
    const { status, skill, ngoEmail } = req.query;
    const query = {};
    if (status) query.status = status;
    if (ngoEmail) {
      const ngo = await User.findOne({ email: ngoEmail.toLowerCase(), role: 'ngo' });
      if (!ngo) return res.json({ success: true, count: 0, tasks: [] });
      query.createdBy = ngo._id;
    }
    if (skill && skill !== 'all') query.$or = [
      { skillsRequired: { $regex: skill, $options: 'i' } },
      { title: { $regex: skill, $options: 'i' } }
    ];
    const tasks = await Task.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: tasks.length, tasks });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, task });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const { title, description, skillsRequired, location, date, time, capacity, ngoName, ngoEmail, status } = req.body;
    if (!title || !location || !ngoEmail) return res.status(400).json({ success: false, message: 'Title, location and NGO email required' });
    const ngo = await User.findOne({ email: ngoEmail.toLowerCase(), role: 'ngo' });
    if (!ngo) return res.status(403).json({ success: false, message: 'NGO account not found' });
    const task = new Task({ title, description: description || '', skillsRequired: Array.isArray(skillsRequired) ? skillsRequired : (skillsRequired ? skillsRequired.split(',').map(s => s.trim()).filter(Boolean) : []), location, date: date || new Date().toISOString().slice(0,10), time: time || '10:00 AM - 02:00 PM', capacity: Number(capacity) || 10, ngoName: ngoName || ngo.name, createdBy: ngo._id, status: ['Draft','Published'].includes(status) ? status : 'Published' });
    await task.save();
    await SystemLog.create({ event: 'New Task Created: ' + task.title + ' (' + task.location + ')', sourceIp: req.ip || '127.0.0.1', level: 'INFO' });
    res.status(201).json({ success: true, message: 'Task created', task });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const allowed = ['title','description','skillsRequired','location','date','time','capacity','status'];
    const update = {};
    allowed.forEach(k => { if (req.body[k] !== undefined) update[k] = req.body[k]; });
    if (update.status && !['Draft','Published','Completed','Cancelled'].includes(update.status)) return res.status(400).json({ success: false, message: 'Invalid task status' });
    const task = await Task.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, task });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try { await Task.findByIdAndDelete(req.params.id); await VolunteerRequest.deleteMany({ task: req.params.id }); res.json({ success: true, message: 'Task deleted' }); }
  catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.post('/:id/apply', async (req, res) => {
  try {
    const { volunteerName, volunteerEmail, volunteerId, skills, notes } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task || task.status !== 'Published') return res.status(404).json({ success: false, message: 'Published task not found' });
    const volunteer = volunteerId ? await User.findOne({ _id: volunteerId, role: 'volunteer' }) : await User.findOne({ email: (volunteerEmail || '').toLowerCase(), role: 'volunteer' });
    if (!volunteer) return res.status(403).json({ success: false, message: 'Volunteer account not found' });
    if ((task.volunteersAssigned || 0) >= task.capacity) return res.status(409).json({ success: false, message: 'Task capacity is full' });
    const existing = await VolunteerRequest.findOne({ task: task._id, volunteer: volunteer._id });
    if (existing) return res.status(409).json({ success: false, message: 'You have already applied for this task' });
    const request = await VolunteerRequest.create({ task: task._id, taskTitle: task.title, volunteer: volunteer._id, volunteerName: volunteer.name, volunteerEmail: volunteer.email, skills: skills || volunteer.skills, notes: notes || 'Ready to serve.' });
    await SystemLog.create({ event: 'Volunteer Request: ' + volunteer.name + ' applied for ' + task.title, sourceIp: req.ip || '127.0.0.1', level: 'INFO' });
    res.status(201).json({ success: true, message: 'Application submitted successfully!', request });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.post('/:id/checkin', async (req, res) => {
  try {
    const { volunteerName, volunteerEmail, volunteerId } = req.body;
    const task = await Task.findById(req.params.id);
    const volunteer = volunteerId ? await User.findById(volunteerId) : await User.findOne({ email: (volunteerEmail || '').toLowerCase() });
    if (!task || !volunteer) return res.status(404).json({ success: false, message: 'Task or volunteer not found' });
    const approved = await VolunteerRequest.findOne({ task: task._id, volunteer: volunteer._id, status: 'Approved' });
    if (!approved) return res.status(403).json({ success: false, message: 'NGO must approve your application before check-in' });
    const already = task.assignedVolunteers.some(v => String(v.volunteerId) === String(volunteer._id) && v.checkedIn);
    if (already) return res.json({ success: true, message: 'Already checked in', task });
    if (task.volunteersAssigned >= task.capacity) return res.status(409).json({ success: false, message: 'Task capacity is full' });
    task.assignedVolunteers.push({ volunteerId: volunteer._id, name: volunteer.name, status: 'Checked In', checkedIn: true, checkedInAt: new Date() });
    await task.save();
    await SystemLog.create({ event: 'Check-In: ' + volunteer.name + ' checked in to ' + task.title, sourceIp: req.ip || '127.0.0.1', level: 'INFO' });
    res.json({ success: true, message: 'Checked into ' + task.title, task });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
