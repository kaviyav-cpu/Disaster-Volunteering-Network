require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./config/db.js');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));
app.use(morgan('dev'));

const frontendPath = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontendPath));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/volunteers', require('./routes/volunteerRoutes'));
app.use('/api/ngo', require('./routes/ngoRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/broadcasts', require('./routes/broadcastRoutes'));
app.use('/api/highlights', require('./routes/highlightRoutes'));

app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    message: 'Disaster Volunteering Network API is running',
    timestamp: new Date().toISOString(),
    database: 'disaster_volunteering_network'
  });
});

app.listen(PORT, () => {
  console.log('==================================================');
  console.log('🚀 DVN Server is running on http://localhost:' + PORT);
  console.log('📦 Frontend served from: ' + frontendPath);
  console.log('🍃 MongoDB URI: ' + (process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/disaster_volunteering_network'));
  console.log('==================================================');
});
