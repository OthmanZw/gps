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
        const device = await Device.findOne({ 
            deviceId,
            user: req.user._id
        });
        
        if (!device) {
            return res.status(404).json({ message: 'Device not found' });
        }

        // Supprimer les anciennes positions
        console.log('Deleting old locations for device:', device._id);
        await Location.deleteMany({ device: device._id });
        console.log('Old locations deleted');

        // Points de test avec des positions bien distinctes
        const testLocations = [
            {
                device: device._id,
                latitude: 48.8534,
                longitude: 2.3488,
                speed: 0,
                altitude: 35,
                heading: 0,
                accuracy: 10,
                batteryLevel: 85,
                timestamp: new Date()
            },
            {
                device: device._id,
                latitude: 48.8634,
                longitude: 2.3588,
                speed: 5,
                altitude: 35,
                heading: 45,
                accuracy: 10,
                batteryLevel: 84,
                timestamp: new Date(Date.now() - 5 * 60000)
            },
            {
                device: device._id,
                latitude: 48.8734,
                longitude: 2.3688,
                speed: 10,
                altitude: 36,
                heading: 90,
                accuracy: 8,
                batteryLevel: 83,
                timestamp: new Date(Date.now() - 10 * 60000)
            },
            {
                device: device._id,
                latitude: 48.8834,
                longitude: 2.3788,
                speed: 15,
                altitude: 37,
                heading: 135,
                accuracy: 9,
                batteryLevel: 82,
                timestamp: new Date(Date.now() - 15 * 60000)
            },
            {
                device: device._id,
                latitude: 48.8934,
                longitude: 2.3888,
                speed: 12,
                altitude: 38,
                heading: 180,
                accuracy: 7,
                batteryLevel: 81,
                timestamp: new Date(Date.now() - 20 * 60000)
            },
            {
                device: device._id,
                latitude: 48.9034,
                longitude: 2.3988,
                speed: 8,
                altitude: 39,
                heading: 225,
                accuracy: 8,
                batteryLevel: 80,
                timestamp: new Date(Date.now() - 25 * 60000)
            }
        ];

        console.log('Test locations to insert:', testLocations.map(loc => ({
            latitude: loc.latitude,
            longitude: loc.longitude,
            timestamp: loc.timestamp
        })));

        await Location.insertMany(testLocations);
        console.log('New locations inserted');

        // Vérifier les positions insérées
        const savedLocations = await Location.find({ device: device._id })
            .sort({ timestamp: 1 })
            .lean();
        
        console.log('Saved locations:', savedLocations.map(loc => ({
            latitude: loc.latitude,
            longitude: loc.longitude,
            timestamp: loc.timestamp
        })));

        // Mettre à jour la dernière position de l'appareil
        device.lastLocation = {
            latitude: testLocations[0].latitude,
            longitude: testLocations[0].longitude,
            timestamp: testLocations[0].timestamp,
            speed: testLocations[0].speed,
            heading: testLocations[0].heading
        };
        device.batteryLevel = testLocations[0].batteryLevel;
        await device.save();
        console.log('Device updated with last location');

        res.status(201).json({
            message: 'Test locations added successfully',
            locations: testLocations
        });
    } catch (error) {
        console.error('Add test locations error:', error);
        res.status(500).json({ message: 'Error adding test locations', error: error.message });
    }
});

// Enregistrer une nouvelle position pour un appareil
router.post('/:deviceId', locationController.recordLocation);

// Obtenir l'historique des positions d'un appareil
router.get('/:deviceId/history', locationController.getLocationHistory);

// Obtenir la dernière position d'un appareil
router.get('/:deviceId/last', locationController.getLastLocation);

module.exports = router; 