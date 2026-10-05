require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Task = require('../models/Task');
const VolunteerRequest = require('../models/VolunteerRequest');
const Proof = require('../models/Proof');
const SystemLog = require('../models/SystemLog');
const Broadcast = require('../models/Broadcast');
const Reminder = require('../models/Reminder');
const Highlight = require('../models/Highlight');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/disaster_volunteering_network';

async function seed() {
  console.log('Connecting to MongoDB at:', MONGO_URI);
  await mongoose.connect(MONGO_URI);
  console.log('Connected! Resetting collections...');

  await Promise.all([
    User.deleteMany({}),
    Task.deleteMany({}),
    VolunteerRequest.deleteMany({}),
    Proof.deleteMany({}),
    SystemLog.deleteMany({}),
    Broadcast.deleteMany({}),
    Reminder.deleteMany({}),
    Highlight.deleteMany({})
  ]);

  console.log('Seeding Users...');
  const users = await User.create([
    {
      name: 'Admin Director',
      email: 'admin@dvn.org',
      password: 'admin',
      role: 'admin',
      city: 'Central Command Headquarters',
      status: 'Active',
      badges: ['System Administrator', 'Network Director']
    },
    {
      name: 'GlobalMedic Rescue',
      email: 'contact@globalmedic.org',
      password: 'ngo',
      role: 'ngo',
      city: 'London, UK',
      registrationNo: 'NGO-GM-8821',
      status: 'Active',
      contactPerson: 'Dr. Sarah Jenkins',
      organizationDescription: 'International rapid disaster response & emergency medicine.'
    },
    {
      name: 'Red Cross Emergency Services',
      email: 'contact@redcross.org',
      password: 'ngo',
      role: 'ngo',
      city: 'California, USA',
      registrationNo: 'NGO-RC-4019',
      status: 'Active',
      contactPerson: 'David Miller',
      organizationDescription: 'Disaster sheltering, food distribution, and community relief.'
    },
    {
      name: 'Kaviya',
      email: 'kaviya@example.com',
      password: 'user',
      role: 'volunteer',
      city: 'California, USA',
      phone: '+1 555-0192',
      status: 'Active',
      skills: ['EMT Certified', 'Water Rescue', 'First Aid'],
      experience: '2 years active field responder in flood evacuation and shelter support.',
      hoursVolunteered: 18,
      monthlyHoursGoal: 25,
      points: 240,
      reliability: 0.95,
      badges: ['Flood Hero', 'Medical Specialist', 'Rapid Responder']
    },
    {
      name: 'Rahul Sharma',
      email: 'rahul@example.com',
      password: 'user',
      role: 'volunteer',
      city: 'Chennai, India',
      status: 'Active',
      skills: ['Logistics', 'Shelter Management', 'Food Distribution'],
      experience: 'Field logistics coordinator for coastal storms.',
      hoursVolunteered: 12,
      points: 160,
      badges: ['Community Champion']
    }
  ]);

  const kaviya = users.find(u => u.name === 'Kaviya');
  const ngo1 = users.find(u => u.name === 'Red Cross Emergency Services');
  const ngo2 = users.find(u => u.name === 'GlobalMedic Rescue');

  console.log('Seeding Tasks...');
  const tasks = await Task.create([
    {
      title: 'Flood Relief Food Distribution',
      description: 'Assist with unloading, sorting, and distributing hot meals and potable drinking water to flood-affected families at the city center shelter.',
      skillsRequired: ['Physical Fitness', 'Teamwork', 'Food Distribution'],
      location: 'City Center Shelter',
      date: '2026-08-15',
      time: '09:00 AM - 02:00 PM',
      capacity: 15,
      volunteersAssigned: 9,
      status: 'Published',
      category: 'Food Supply',
      matchRating: 98,
      ngoName: 'Red Cross Emergency Services',
      createdBy: ngo1._id,
      assignedVolunteers: [
        { volunteerId: kaviya._id, name: 'Kaviya', status: 'Confirmed', checkedIn: true, checkedInAt: new Date() }
      ]
    },
    {
      title: 'Medical Camp Support - Shelter A',
      description: 'Support the emergency medical doctor unit with patient triage intake, hygiene kits, and basic wound treatment.',
      skillsRequired: ['EMT Certified', 'First Aid'],
      location: 'Shelter A, North Sector',
      date: '2026-08-22',
      time: '09:00 AM - 01:00 PM',
      capacity: 8,
      volunteersAssigned: 7,
      status: 'Published',
      category: 'Medical Camp',
      matchRating: 95,
      ngoName: 'GlobalMedic Rescue',
      createdBy: ngo2._id
    },
    {
      title: 'Flood Rescue Boat Handler & Evac',
      description: 'Pilot safety Zodiac boats and help extract stranded residents along the flooded riverside basin.',
      skillsRequired: ['Water Rescue', 'Physical Fitness'],
      location: 'Zone 4 Riverbank Basin',
      date: '2026-08-25',
      time: '07:00 AM - 12:00 PM',
      capacity: 10,
      volunteersAssigned: 4,
      status: 'Published',
      category: 'Water Rescue',
      matchRating: 92,
      ngoName: 'Red Cross Emergency Services',
      createdBy: ngo1._id
    },
    {
      title: 'Debris Clearance & Route Restoration',
      description: 'Clear fallen trees and storm debris blocking emergency ambulance access lanes.',
      skillsRequired: ['Physical Fitness'],
      location: 'Ward 7 South Corridor',
      date: '2026-08-28',
      time: '08:00 AM - 01:00 PM',
      capacity: 20,
      volunteersAssigned: 4,
      status: 'Draft',
      category: 'Logistics',
      matchRating: 75,
      ngoName: 'GlobalMedic Rescue',
      createdBy: ngo2._id
    }
  ]);

  console.log('Seeding Volunteer Requests...');
  await VolunteerRequest.create([
    {
      task: tasks[0]._id,
      taskTitle: tasks[0].title,
      volunteer: kaviya._id,
      volunteerName: 'Kaviya',
      volunteerEmail: 'kaviya@example.com',
      skills: ['EMT Certified', 'Water Rescue'],
      status: 'Pending',
      notes: 'Available for both morning and afternoon relief shifts.'
    },
    {
      task: tasks[1]._id,
      taskTitle: tasks[1].title,
      volunteer: users[4]._id,
      volunteerName: 'Rahul Sharma',
      volunteerEmail: 'rahul@example.com',
      skills: ['Logistics', 'Shelter Management'],
      status: 'Pending',
      notes: 'Ready to assist with medical supply distribution.'
    }
  ]);

  console.log('Seeding Proofs of Service...');
  await Proof.create([
    {
      volunteer: kaviya._id,
      volunteerName: 'Kaviya',
      task: tasks[0]._id,
      taskTitle: 'Flood Relief Food Distribution',
      hours: 4,
      comments: 'Delivered 120 emergency food and water kits in Sector 3.',
      status: 'Pending'
    },
    {
      volunteer: users[4]._id,
      volunteerName: 'Rahul Sharma',
      task: tasks[1]._id,
      taskTitle: 'Medical Camp Support - Shelter A',
      hours: 6,
      comments: 'Managed patient registration for 60 individuals.',
      status: 'Approved',
      adminFeedback: 'Verified by Shelter Director.',
      verifiedAt: new Date()
    }
  ]);

  console.log('Seeding System Logs...');
  await SystemLog.create([
    {
      event: 'Disaster Network Command Center Activated',
      sourceIp: '127.0.0.1',
      level: 'INFO'
    },
    {
      event: 'New NGO Verification Approved (GlobalMedic Rescue)',
      sourceIp: '192.168.1.1',
      level: 'AUDIT'
    },
    {
      event: 'Database Backup Automated Command Executed',
      sourceIp: '10.0.0.4',
      level: 'INFO'
    },
    {
      event: 'Emergency High-Water Siren Broadcast Dispatched',
      sourceIp: '127.0.0.1',
      level: 'CRITICAL'
    }
  ]);

  console.log('Seeding Emergency Broadcast...');
  await Broadcast.create({
    title: 'Flood Level Alert - Hub 4',
    message: 'Listen to the latest audio warning and crisis updates broadcasted across network hubs.',
    severity: 'HIGH',
    audioFile: 'alexis_gaming_cam-accepter-2-394924.mp3',
    active: true
  });

  console.log('Seeding Reminders...');
  await Reminder.create([
    {
      userId: kaviya._id,
      userEmail: 'kaviya@example.com',
      text: 'Collect high-visibility emergency vest from Sector 2 depot',
      done: false
    },
    {
      userId: kaviya._id,
      userEmail: 'kaviya@example.com',
      text: 'Upload proof photo for Food Distribution hours',
      done: true
    }
  ]);

  console.log('Seeding Highlights...');
  await Highlight.create([
    { text: 'Over 1,200 food and water ration packs distributed in flood zone.' },
    { text: 'Rapid mobile medical clinic established in Sector 4.' },
    { text: '85 trained volunteers mobilized across 3 regional command centers.' }
  ]);

  console.log('Seeding complete! Disconnecting...');
  await mongoose.disconnect();
  console.log('Done!');
}

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
