const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Proof = require('../models/Proof');
const Reminder = require('../models/Reminder');
const SystemLog = require('../models/SystemLog');

router.get('/profile', async (req, res) => {
  try {
    const email = (req.query.email || '').toLowerCase();
    let user = await User.findOne({ email });
    if (!user || user.role !== 'volunteer') return res.status(404).json({ success:false, message:'Volunteer not found' });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/profile', async (req, res) => {
  try {
    const email = req.body.email || 'kaviya@example.com';
    const user = await User.findOne({ email, role:'volunteer' }); if (!user) return res.status(404).json({success:false,message:'Volunteer not found'}); ['name','city','phone','experience','monthlyHoursGoal'].forEach(k=>{if(req.body[k]!==undefined) user[k]=req.body[k];}); await user.save();
    res.json({ success: true, message: 'Profile updated', user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/skills', async (req, res) => {
  try {
    const { email, skill } = req.body;
    const user = await User.findOne({ email: email || 'kaviya@example.com' });
    if (user && skill && !user.skills.includes(skill)) {
      user.skills.push(skill);
      await user.save();
    }
    res.json({ success: true, skills: user ? user.skills : [skill] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


router.get('/applications', async (req, res) => {
  try {
    const email=(req.query.email||'').toLowerCase();
    const volunteer=await User.findOne({email,role:'volunteer'});
    if(!volunteer) return res.status(404).json({success:false,message:'Volunteer not found'});
    const VolunteerRequest = require('../models/VolunteerRequest');
    const requests=await VolunteerRequest.find({volunteer:volunteer._id}).sort({appliedAt:-1});
    res.json({success:true,requests});
  } catch(err){res.status(500).json({success:false,message:err.message});}
});

// Complete volunteer task history. A task is shown as Completed as soon as
// proof is uploaded; NGO verification remains a separate proof status.
router.get('/history', async (req, res) => {
  try {
    const email=(req.query.email||'').toLowerCase();
    const volunteer=await User.findOne({email,role:'volunteer'});
    if(!volunteer) return res.status(404).json({success:false,message:'Volunteer not found'});
    const VolunteerRequest = require('../models/VolunteerRequest');
    const requests=await VolunteerRequest.find({volunteer:volunteer._id}).sort({appliedAt:-1}).lean();
    const taskIds=requests.map(r=>r.task);
    const proofs=await Proof.find({volunteer:volunteer._id, task:{$in:taskIds}}).sort({submittedAt:-1}).lean();
    const proofByTask=new Map();
    for (const proof of proofs) if(!proofByTask.has(String(proof.task))) proofByTask.set(String(proof.task), proof);
    const history=requests.map(r=>{
      const proof=proofByTask.get(String(r.task));
      return {
        ...r,
        historyStatus: proof ? 'Completed' : 'Applied',
        proofStatus: proof ? proof.status : null,
        proofHours: proof ? proof.hours : 0,
        proofSubmittedAt: proof ? proof.submittedAt : null,
        proofId: proof ? proof._id : null
      };
    });
    res.json({success:true,history});
  } catch(err){res.status(500).json({success:false,message:err.message});}
});

router.get('/reminders', async (req, res) => {
  try {
    const email = (req.query.email || '').toLowerCase();
    const reminders = await Reminder.find(email ? { userEmail: email } : {}).sort({ createdAt: -1 });
    res.json({ success: true, reminders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/reminders', async (req, res) => {
  try {
    const { text, userEmail } = req.body;
    const r = new Reminder({ text, userEmail: userEmail || 'kaviya@example.com' });
    await r.save();
    res.status(201).json({ success: true, reminder: r });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/reminders/:id', async (req, res) => {
  try {
    const r = await Reminder.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, reminder: r });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/reminders/:id', async (req, res) => {
  try {
    await Reminder.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/proof', async (req, res) => {
  try {
    const { volunteerName, volunteerEmail, volunteerId, taskId, taskTitle, hours, imageProof, comments } = req.body;
    const volunteer = volunteerId ? await User.findOne({ _id: volunteerId, role: 'volunteer' }) : await User.findOne({ email: (volunteerEmail || '').toLowerCase(), role: 'volunteer' });
    if (!volunteer) return res.status(403).json({ success: false, message: 'Volunteer account not found' });
    const Task = require('../models/Task');
    const task = taskId ? await Task.findById(taskId) : null;
    if (!task) return res.status(400).json({ success: false, message: 'Completed task is required' });
    const approved = await require('../models/VolunteerRequest').findOne({ task: task._id, volunteer: volunteer._id, status: 'Approved' });
    if (!approved) return res.status(403).json({ success: false, message: 'Only approved task assignments can submit proof' });
    const existingProof = await Proof.findOne({ task: task._id, volunteer: volunteer._id });
    if (existingProof) return res.status(409).json({ success: false, message: 'Proof has already been uploaded for this task', proof: existingProof });
    const proof = new Proof({
      volunteer: volunteer._id, volunteerName: volunteer.name, task: task._id, taskTitle: task.title,
      hours: Number(hours) || 1, imageProof: imageProof || '', comments: comments || '', status: 'Pending'
    });
    await proof.save();
    await SystemLog.create({
      event: 'Proof Uploaded: ' + proof.volunteerName + ' (' + proof.hours + ' hrs)',
      sourceIp: req.ip || '127.0.0.1', level: 'INFO'
    });
    res.status(201).json({ success: true, message: 'Proof submitted to coordinator', proof });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


// Generate an official badge only after at least one proof has been approved by the NGO.
router.post('/badge', async (req, res) => {
  try {
    const email = (req.body.email || '').toLowerCase();
    if (!email) return res.status(400).json({ success: false, message: 'Volunteer email required' });

    const volunteer = await User.findOne({ email, role: 'volunteer' });
    if (!volunteer) return res.status(404).json({ success: false, message: 'Volunteer not found' });

    const approvedProof = await Proof.findOne({ volunteer: volunteer._id, status: 'Approved' }).sort({ verifiedAt: -1 });
    if (!approvedProof) {
      return res.status(403).json({
        success: false,
        eligible: false,
        message: 'Badge generation is available only after NGO approval of a proof.'
      });
    }

    const badgeName = 'Certified Disaster Volunteer Specialist';
    if (!volunteer.badges.includes(badgeName)) {
      volunteer.badges.push(badgeName);
      await volunteer.save();
    }

    res.json({
      success: true,
      eligible: true,
      badge: badgeName,
      badgeId: 'DVN-' + String(volunteer._id).slice(-6).toUpperCase()
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/badge-eligibility', async (req, res) => {
  try {
    const email = (req.query.email || '').toLowerCase();
    const volunteer = await User.findOne({ email, role: 'volunteer' });
    if (!volunteer) return res.status(404).json({ success: false, message: 'Volunteer not found' });
    const approvedProof = await Proof.findOne({ volunteer: volunteer._id, status: 'Approved' }).select('_id taskTitle verifiedAt');
    res.json({ success: true, eligible: !!approvedProof, approvedProof: approvedProof || null, badges: volunteer.badges || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
