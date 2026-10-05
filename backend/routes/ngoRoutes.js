const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const VolunteerRequest = require('../models/VolunteerRequest');
const Proof = require('../models/Proof');
const User = require('../models/User');

function ngoFilter(req) {
  return req.query.ngoEmail ? { createdBy: req.query.ngoEmail } : {};
}

async function getNgo(req) {
  const email = req.query.ngoEmail || req.body.ngoEmail;
  return email ? User.findOne({ email: email.toLowerCase(), role: 'ngo' }) : null;
}

router.get('/profile', async (req, res) => {
  try { const ngo = await getNgo(req); if (!ngo) return res.status(400).json({ success:false, message:'Valid NGO email required' }); res.json({ success:true, user: ngo }); }
  catch (err) { res.status(500).json({ success:false, message:err.message }); }
});

router.put('/profile', async (req, res) => {
  try { const email=(req.body.email||'').toLowerCase(); const ngo=await User.findOne({email,role:'ngo'}); if(!ngo) return res.status(404).json({success:false,message:'NGO not found'});
    const allowed={name:'name',registrationNo:'registrationNo',phone:'phone',city:'city',organizationDescription:'organizationDescription'}; Object.keys(allowed).forEach(k=>{if(req.body[k]!==undefined) ngo[k]=req.body[k];}); await ngo.save(); res.json({success:true,user:ngo});
  } catch(err){res.status(500).json({success:false,message:err.message});}
});

router.get('/summary', async (req, res) => {
  try {
    const ngo = await getNgo(req);
    if (!ngo) return res.status(400).json({ success: false, message: 'Valid NGO email required' });
    const tasks = await Task.find({ createdBy: ngo._id });
    const taskIds = tasks.map(t => t._id);
    const pendingRequests = await VolunteerRequest.countDocuments({ task: { $in: taskIds }, status: 'Pending' });
    const pendingProofs = await Proof.countDocuments({ task: { $in: taskIds }, status: 'Pending' });
    res.json({ success: true, summary: {
      totalTasks: tasks.length,
      publishedTasks: tasks.filter(t => t.status === 'Published').length,
      draftTasks: tasks.filter(t => t.status === 'Draft').length,
      closedTasks: tasks.filter(t => ['Cancelled', 'Completed'].includes(t.status)).length,
      totalVolunteersAssigned: tasks.reduce((sum, t) => sum + (t.volunteersAssigned || 0), 0),
      pendingRequests, pendingProofs
    }});
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.get('/requests', async (req, res) => {
  try {
    const ngo = await getNgo(req);
    if (!ngo) return res.status(400).json({ success: false, message: 'Valid NGO email required' });
    const tasks = await Task.find({ createdBy: ngo._id }).select('_id');
    const requests = await VolunteerRequest.find({ task: { $in: tasks.map(t => t._id) } }).sort({ appliedAt: -1 });
    res.json({ success: true, count: requests.length, requests });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.put('/requests/:id', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Pending', 'Approved', 'Rejected'].includes(status)) return res.status(400).json({ success: false, message: 'Invalid status' });
    const request = await VolunteerRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: 'Request not found' });
    const ngo = await getNgo(req);
    if (!ngo) return res.status(400).json({ success: false, message: 'Valid NGO email required' });
    const task = await Task.findOne({ _id: request.task, createdBy: ngo._id });
    if (!task) return res.status(403).json({ success: false, message: 'Request does not belong to this NGO' });
    if (request.status === 'Approved' && status !== 'Approved') task.volunteersAssigned = Math.max(0, task.volunteersAssigned - 1);
    if (request.status !== 'Approved' && status === 'Approved') {
      if (task.volunteersAssigned >= task.capacity) return res.status(409).json({ success: false, message: 'Task capacity is full' });
      task.volunteersAssigned += 1;
    }
    request.status = status;
    await request.save();
    await task.save();
    res.json({ success: true, message: 'Request ' + status, request });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.get('/proofs', async (req, res) => {
  try {
    const ngo = await getNgo(req);
    if (!ngo) return res.status(400).json({ success: false, message: 'Valid NGO email required' });
    const tasks = await Task.find({ createdBy: ngo._id }).select('_id');
    const proofs = await Proof.find({ task: { $in: tasks.map(t => t._id) } }).sort({ submittedAt: -1 });
    res.json({ success: true, count: proofs.length, proofs });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.put('/proofs/:id', async (req, res) => {
  try {
    const { status, adminFeedback } = req.body;
    if (!['Pending', 'Approved', 'Rejected'].includes(status)) return res.status(400).json({ success: false, message: 'Invalid status' });
    const ngo = await getNgo(req);
    if (!ngo) return res.status(400).json({ success: false, message: 'Valid NGO email required' });
    const proof = await Proof.findById(req.params.id);
    if (!proof) return res.status(404).json({ success: false, message: 'Proof not found' });
    const task = await Task.findOne({ _id: proof.task, createdBy: ngo._id });
    if (!task) return res.status(403).json({ success: false, message: 'Proof does not belong to this NGO' });
    const wasApproved = proof.status === 'Approved';
    proof.status = status;
    proof.adminFeedback = adminFeedback || '';
    proof.verifiedAt = status === 'Pending' ? undefined : new Date();
    await proof.save();
    const volunteer = proof.volunteer ? await User.findById(proof.volunteer) : await User.findOne({ email: proof.volunteerEmail });
    if (volunteer && !wasApproved && status === 'Approved') {
      volunteer.hoursVolunteered += proof.hours;
      volunteer.points += proof.hours * 20;
      await volunteer.save();
    } else if (volunteer && wasApproved && status !== 'Approved') {
      volunteer.hoursVolunteered = Math.max(0, volunteer.hoursVolunteered - proof.hours);
      volunteer.points = Math.max(0, volunteer.points - proof.hours * 20);
      await volunteer.save();
    }
    res.json({ success: true, message: 'Proof ' + status, proof });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.get('/volunteers', async (req, res) => {
  try {
    const ngo = await getNgo(req);
    if (!ngo) return res.status(400).json({ success: false, message: 'Valid NGO email required' });
    const tasks = await Task.find({ createdBy: ngo._id }).select('_id');
    const requests = await VolunteerRequest.find({ task: { $in: tasks.map(t => t._id) }, status: 'Approved' }).sort({ appliedAt: -1 });
    const ids = [...new Set(requests.map(r => String(r.volunteer)))];
    const volunteers = await User.find({ _id: { $in: ids }, role: 'volunteer' }).select('-password');
    res.json({ success: true, count: volunteers.length, volunteers, assignments: requests });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
