const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');
const { auth } = require('../middleware/auth');
const Device = require('../models/Device');
const Location = require('../models/Location');

// Toutes les routes nécessitent une authentification
router.use(auth);

// Route de test pour ajouter des données de localisation
router.post('/test/:deviceId', async (req, res) => {
    try {
        const { deviceId } = req.params;
        const device = await Device.findOne({ deviceId, user: req.user._id });
        
        if (!device) {
            return res.status(404).json({ message: 'Device not found' });
        }

        // Créer quelques positions de test
        const testLocations = [
            {
                device: device._id,
                latitude: 48.8566,
                longitude: 2.3522,
                speed: 0,
                altitude: 35,
                heading: 0,
                accuracy: 10,
                batteryLevel: 85,
                timestamp: new Date()
            },
            {
                device: device._id,
                latitude: 48.8576,
                longitude: 2.3532,
                speed: 5,
                altitude: 35,
                heading: 45,
                accuracy: 10,
                batteryLevel: 84,
                timestamp: new Date(Date.now() - 5 * 60000)
            }
        ];

        await Location.insertMany(testLocations);

        // Mettre à jour la dernière position de l'appareil
        device.lastLocation = {
            latitude: testLocations[0].latitude,
            longitude: testLocations[0].longitude,
            timestamp: testLocations[0].timestamp
        };
        device.batteryLevel = testLocations[0].batteryLevel;
        await device.save();

        res.status(201).json({
            message: 'Test locations added successfully',
            locations: testLocations
        });
    } catch (error) {
        console.error('Add test locations error:', error);
        res.status(500).json({ message: 'Error adding test locations' });
    }
});

// Enregistrer une nouvelle position pour un appareil
router.post('/:deviceId', locationController.recordLocation);

// Obtenir l'historique des positions d'un appareil
router.get('/:deviceId/history', locationController.getLocationHistory);

// Obtenir la dernière position d'un appareil
router.get('/:deviceId/last', locationController.getLastLocation);

module.exports = router; 