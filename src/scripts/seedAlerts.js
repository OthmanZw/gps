require('dotenv').config();
const mongoose = require('mongoose');
const { AlertRule } = require('../models/Alert');
const { AlertHistory } = require('../models/Alert');

// ID de l'utilisateur récupéré
const USER_ID = '67d0d45e915e8164fd8aecb6';

async function seedData() {
  try {
    console.log('Connecté à MongoDB');
    
    // Supprimer les données existantes pour cet utilisateur
    await AlertRule.deleteMany({ userId: USER_ID });
    await AlertHistory.deleteMany({ userId: USER_ID });

    // Créer les règles d'alerte
    const alertRules = await AlertRule.create([
      {
        type: 'battery',
        name: 'Alerte batterie faible',
        threshold: 15,
        enabled: true,
        notifyBy: ['app', 'email'],
        userId: USER_ID
      },
      {
        type: 'speed',
        name: 'Excès de vitesse',
        threshold: 130,
        enabled: true,
        notifyBy: ['app', 'sms'],
        userId: USER_ID
      },
      {
        type: 'geofence',
        name: 'Sortie de zone école',
        threshold: 500,
        enabled: true,
        notifyBy: ['app', 'email', 'sms'],
        userId: USER_ID
      }
    ]);

    console.log('Règles d\'alerte créées:', alertRules);

    // Créer l'historique des alertes avec plus d'entrées
    const now = new Date();
    const alertHistory = await AlertHistory.create([
      {
        deviceId: 'GPS-001',
        type: 'battery',
        message: 'Batterie critique (10%)',
        severity: 'error',
        status: 'unread',
        userId: USER_ID,
        createdAt: new Date(now - 5 * 60000) // 5 minutes ago
      },
      {
        deviceId: 'GPS-002',
        type: 'speed',
        message: 'Vitesse excessive: 145 km/h',
        severity: 'error',
        status: 'unread',
        userId: USER_ID,
        createdAt: new Date(now - 10 * 60000) // 10 minutes ago
      },
      {
        deviceId: 'GPS-003',
        type: 'geofence',
        message: 'Sortie de la zone "École"',
        severity: 'warning',
        status: 'unread',
        userId: USER_ID,
        createdAt: new Date(now - 15 * 60000) // 15 minutes ago
      },
      {
        deviceId: 'GPS-001',
        type: 'battery',
        message: 'Batterie faible (20%)',
        severity: 'warning',
        status: 'unread',
        userId: USER_ID,
        createdAt: new Date(now - 20 * 60000) // 20 minutes ago
      },
      {
        deviceId: 'GPS-004',
        type: 'offline',
        message: 'Appareil hors ligne depuis 30 minutes',
        severity: 'warning',
        status: 'unread',
        userId: USER_ID,
        createdAt: new Date(now - 30 * 60000) // 30 minutes ago
      },
      {
        deviceId: 'GPS-005',
        type: 'speed',
        message: 'Vitesse excessive: 138 km/h',
        severity: 'error',
        status: 'unread',
        userId: USER_ID,
        createdAt: new Date(now - 8 * 60000) // 8 minutes ago
      },
      {
        deviceId: 'GPS-006',
        type: 'geofence',
        message: 'Entrée dans zone restreinte "Entrepôt"',
        severity: 'warning',
        status: 'unread',
        userId: USER_ID,
        createdAt: new Date(now - 12 * 60000) // 12 minutes ago
      },
      {
        deviceId: 'GPS-002',
        type: 'battery',
        message: 'Batterie critique (5%)',
        severity: 'error',
        status: 'unread',
        userId: USER_ID,
        createdAt: new Date(now - 3 * 60000) // 3 minutes ago
      },
      {
        deviceId: 'GPS-007',
        type: 'offline',
        message: 'Perte de signal GPS',
        severity: 'error',
        status: 'unread',
        userId: USER_ID,
        createdAt: new Date(now - 2 * 60000) // 2 minutes ago
      },
      {
        deviceId: 'GPS-003',
        type: 'speed',
        message: 'Vitesse excessive: 142 km/h',
        severity: 'error',
        status: 'unread',
        userId: USER_ID,
        createdAt: new Date(now - 1 * 60000) // 1 minute ago
      }
    ]);

    console.log('Historique des alertes créé:', alertHistory);
    console.log('Données de test insérées avec succès !');

  } catch (error) {
    console.error('Erreur lors de l\'insertion des données:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Déconnecté de MongoDB');
  }
}

// Connexion à MongoDB et exécution du script
mongoose.connect(process.env.MONGODB_URI)
  .then(seedData)
  .catch(err => {
    console.error('Erreur de connexion à MongoDB:', err);
    process.exit(1);
  }); 