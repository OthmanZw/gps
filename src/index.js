require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const deviceRoutes = require('./routes/devices');
const locationRoutes = require('./routes/locations');
const alertRoutes = require('./routes/alerts');
// const notificationRoutes = require('./routes/notificationRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/alerts', alertRoutes);
// app.use('/api/notifications', notificationRoutes);

// MongoDB Connection
console.log('Tentative de connexion à MongoDB...');
console.log(`URL de connexion: ${process.env.MONGODB_URI.replace(/othman:othman/, 'othman:****')}`);

// Options de connexion MongoDB adaptées pour macOS Monterey
const mongooseOptions = {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 45000,
  family: 4,
  directConnection: true,
  ssl: false
};

mongoose.connect(process.env.MONGODB_URI, mongooseOptions)
  .then(() => {
    console.log('Connected to MongoDB successfully!');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
    console.log('Mode sans base de données activé - Utilisation de données en mémoire');
    // Ne pas quitter le processus en cas d'erreur
    // process.exit(1);
  });

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to GPS Tracker API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 