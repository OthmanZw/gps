require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dns = require('dns');
const authRoutes = require('./routes/auth');
const deviceRoutes = require('./routes/devices');
const locationRoutes = require('./routes/locations');
const alertRoutes = require('./routes/alerts');
// const notificationRoutes = require('./routes/notificationRoutes');

// Configurer les serveurs DNS de Google pour résoudre les problèmes de connexion à MongoDB
dns.setServers([
  '8.8.8.8',  // DNS primaire de Google
  '8.8.4.4'   // DNS secondaire de Google
]);
console.log('Serveurs DNS configurés:', dns.getServers());

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
const mongoUri = process.env.MONGODB_URI;
console.log('Tentative de connexion à MongoDB...');
console.log(`URL de connexion: ${mongoUri.replace(/othman:othman/, 'othman:****')}`);

// Options de connexion MongoDB simplifiées qui ont fonctionné
const mongooseOptions = {
  serverSelectionTimeoutMS: 20000, // Timeout à 20 secondes
};

// Si l'URL n'est pas de type SRV et contient une adresse IP directe, ajouter directConnection
if (!mongoUri.startsWith('mongodb+srv://')) {
  mongooseOptions.directConnection = true;
  console.log('Option directConnection activée');
} else {
  console.log('URL SRV détectée, option directConnection désactivée');
}

console.log('Options de connexion:', JSON.stringify(mongooseOptions));

mongoose.connect(mongoUri, mongooseOptions)
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