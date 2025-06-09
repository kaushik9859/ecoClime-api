const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Enable CORS
app.use(cors());

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/vegetation', require('./routes/vegetationRoutes'));
app.use('/api/cropsuggestion', require('./routes/cropRoutes'));
app.use('/api/cropdisease', require('./routes/diseaseRoutes'));
app.use('/api/alerts', require('./routes/alertRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));

// Index route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the AgriTech API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!' });
});

module.exports = app;