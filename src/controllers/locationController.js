const Location = require('../models/Location');
const Device = require('../models/Device');
// const notificationController = require('./notificationController');

// Enregistrer une nouvelle position
exports.recordLocation = async (req, res) => {
    try {
        const { deviceId } = req.params;
        const { latitude, longitude, speed, altitude, heading, accuracy, batteryLevel } = req.body;

        // Vérifier que l'appareil appartient à l'utilisateur
        const device = await Device.findOne({
            deviceId: deviceId,
            user: req.user._id
        });

        if (!device) {
            return res.status(404).json({ message: 'Device not found' });
        }

        // Créer la nouvelle position
        const location = new Location({
            device: device._id,
            latitude,
            longitude,
            speed,
            altitude,
            heading,
            accuracy,
            batteryLevel
        });

        await location.save();

        // Mettre à jour la dernière position de l'appareil
        device.lastLocation = {
            latitude,
            longitude,
            timestamp: new Date()
        };
        device.batteryLevel = batteryLevel;
        await device.save();

        // Vérifier le niveau de batterie et créer une notification si nécessaire
        // await notificationController.checkBatteryLevel(deviceId, batteryLevel);

        res.status(201).json({
            message: 'Location recorded successfully',
            location
        });
    } catch (error) {
        console.error('Record location error:', error);
        res.status(500).json({ message: 'Error recording location' });
    }
};

// Obtenir l'historique des positions d'un appareil
exports.getLocationHistory = async (req, res) => {
    try {
        const { deviceId } = req.params;
        const { start, end, limit = 100 } = req.query;

        // Vérifier que l'appareil appartient à l'utilisateur
        const device = await Device.findOne({
            deviceId: deviceId,
            user: req.user._id
        });

        if (!device) {
            return res.status(404).json({ message: 'Device not found' });
        }

        // Construire la requête
        const query = { device: device._id };
        if (start || end) {
            query.timestamp = {};
            if (start) query.timestamp.$gte = new Date(start);
            if (end) query.timestamp.$lte = new Date(end);
        }

        const locations = await Location.find(query)
            .sort({ timestamp: -1 })
            .limit(parseInt(limit))
            .select('latitude longitude timestamp speed altitude heading accuracy batteryLevel')
            .lean();

        // Transformer les données pour le frontend
        const formattedLocations = locations.map(loc => ({
            latitude: loc.latitude,
            longitude: loc.longitude,
            timestamp: loc.timestamp,
            speed: loc.speed,
            altitude: loc.altitude,
            heading: loc.heading,
            accuracy: loc.accuracy,
            batteryLevel: loc.batteryLevel
        }));

        res.json(formattedLocations);
    } catch (error) {
        console.error('Get location history error:', error);
        res.status(500).json({ message: 'Error fetching location history' });
    }
};

// Obtenir la dernière position d'un appareil
exports.getLastLocation = async (req, res) => {
    try {
        const { deviceId } = req.params;

        // Vérifier que l'appareil appartient à l'utilisateur
        const device = await Device.findOne({
            deviceId: deviceId,
            user: req.user._id
        });

        if (!device) {
            return res.status(404).json({ message: 'Device not found' });
        }

        const lastLocation = await Location.findOne({ device: device._id })
            .sort({ timestamp: -1 })
            .select('latitude longitude timestamp speed altitude heading accuracy batteryLevel')
            .lean();

        if (!lastLocation) {
            return res.status(404).json({ message: 'No location data found' });
        }

        res.json(lastLocation);
    } catch (error) {
        console.error('Get last location error:', error);
        res.status(500).json({ message: 'Error fetching last location' });
    }
}; 