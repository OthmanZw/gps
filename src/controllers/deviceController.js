// const Device = require('../models/Device');
// const Driver = require('../models/Driver');

// Données de test en mémoire
const testDevices = [
    {
        _id: '1',
        deviceId: 'CON-001',
        name: 'Connecteur GPS 1',
        type: 'connecteur',
        status: 'active',
        lastPosition: {
            latitude: 48.8566,
            longitude: 2.3522,
            speed: 0,
            heading: 0,
            timestamp: new Date()
        },
        batteryLevel: 85,
        user: '123456789'
    },
    {
        _id: '2',
        deviceId: 'VEH-001',
        name: 'Véhicule 1',
        type: 'voiture',
        brand: 'Tesla',
        model: 'Model 3',
        year: 2023,
        registrationNumber: 'AB-123-CD',
        fuelType: 'électrique',
        status: 'active',
        lastPosition: {
            latitude: 48.8566,
            longitude: 2.3522,
            speed: 0,
            heading: 0,
            timestamp: new Date()
        },
        batteryLevel: 75,
        user: '123456789'
    },
    {
        _id: '3',
        deviceId: 'PER-001',
        name: 'Traceur Personnel 1',
        type: 'personnel',
        status: 'active',
        lastPosition: {
            latitude: 48.8566,
            longitude: 2.3522,
            speed: 0,
            heading: 0,
            timestamp: new Date()
        },
        batteryLevel: 90,
        user: '123456789'
    }
];

// Créer un nouvel appareil/véhicule
exports.createDevice = async (req, res) => {
    try {
        const deviceData = {
            ...req.body,
            _id: (testDevices.length + 1).toString(),
            user: req.user.userId,
            deviceId: `DEV-${(testDevices.length + 1).toString().padStart(3, '0')}`,
            type: req.body.type || 'voiture',
            brand: req.body.brand || 'Test Brand',
            model: req.body.model || 'Test Model',
            year: req.body.year || 2024,
            registrationNumber: req.body.registrationNumber || `TEST-${(testDevices.length + 1).toString().padStart(3, '0')}`,
            fuelType: req.body.fuelType || 'électrique',
            status: 'active',
            lastPosition: {
                latitude: 48.8566,
                longitude: 2.3522,
                speed: 0,
                heading: 0,
                timestamp: new Date()
            },
            batteryLevel: 100
        };

        testDevices.push(deviceData);
        console.log(`Nouvel appareil créé: ${deviceData.deviceId}`);

        res.status(201).json(deviceData);
    } catch (error) {
        console.error('Erreur lors de la création de l\'appareil:', error);
        res.status(400).json({ message: 'Erreur lors de la création de l\'appareil', error: error.message });
    }
};

// Obtenir tous les appareils de l'entreprise
exports.getDevices = async (req, res) => {
    try {
        // Filtrer les appareils par utilisateur
        const devices = testDevices.filter(device => device.user === req.user.userId);
        console.log(`Récupération de ${devices.length} appareils`);
        res.json(devices);
    } catch (error) {
        console.error('Erreur lors de la récupération des appareils:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Obtenir un appareil spécifique
exports.getDevice = async (req, res) => {
    try {
        const device = testDevices.find(
            d => d.deviceId === req.params.id && d.user === req.user.userId
        );

        if (!device) {
            return res.status(404).json({ message: 'Appareil non trouvé' });
        }

        console.log(`Récupération de l'appareil: ${device.deviceId}`);
        res.json(device);
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'appareil:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Mettre à jour un appareil
exports.updateDevice = async (req, res) => {
    try {
        const deviceIndex = testDevices.findIndex(
            d => d.deviceId === req.params.id && d.user === req.user.userId
        );

        if (deviceIndex === -1) {
            return res.status(404).json({ message: 'Appareil non trouvé' });
        }

        // Mettre à jour l'appareil
        testDevices[deviceIndex] = {
            ...testDevices[deviceIndex],
            ...req.body,
            user: req.user.userId // Conserver l'utilisateur d'origine
        };

        console.log(`Appareil mis à jour: ${testDevices[deviceIndex].deviceId}`);
        res.json(testDevices[deviceIndex]);
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'appareil:', error);
        res.status(400).json({ message: 'Erreur lors de la mise à jour de l\'appareil' });
    }
};

// Supprimer un appareil
exports.deleteDevice = async (req, res) => {
    try {
        const deviceIndex = testDevices.findIndex(
            d => d.deviceId === req.params.id && d.user === req.user.userId
        );

        if (deviceIndex === -1) {
            return res.status(404).json({ message: 'Appareil non trouvé' });
        }

        // Supprimer l'appareil
        const deletedDevice = testDevices.splice(deviceIndex, 1)[0];
        console.log(`Appareil supprimé: ${deletedDevice.deviceId}`);

        res.json({ message: 'Appareil supprimé avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'appareil:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Mettre à jour la position d'un appareil
exports.updateLocation = async (req, res) => {
    try {
        const { latitude, longitude, speed, heading } = req.body;
        const deviceIndex = testDevices.findIndex(
            d => d.deviceId === req.params.id && d.user === req.user.userId
        );

        if (deviceIndex === -1) {
            return res.status(404).json({ message: 'Appareil non trouvé' });
        }

        // Mettre à jour la position
        testDevices[deviceIndex].lastPosition = {
            latitude,
            longitude,
            speed: speed || 0,
            heading: heading || 0,
            timestamp: new Date()
        };

        console.log(`Position mise à jour pour l'appareil: ${testDevices[deviceIndex].deviceId}`);
        res.json(testDevices[deviceIndex]);
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la position:', error);
        res.status(400).json({ message: 'Erreur lors de la mise à jour de la position' });
    }
};

// Assigner un conducteur à un appareil
exports.assignDriver = async (req, res) => {
    try {
        const { driverId } = req.body;
        const device = testDevices.find(
            d => d.deviceId === req.params.id && d.user === req.user.userId
        );

        if (!device) {
            return res.status(404).json({ message: 'Appareil non trouvé' });
        }

        const driver = testDevices.find(
            d => d._id === driverId && d.user === req.user.userId
        );

        if (!driver) {
            return res.status(404).json({ message: 'Conducteur non trouvé' });
        }

        // Mettre à jour l'appareil
        device.currentDriver = driver._id;
        device.status = 'active';

        // Mettre à jour le conducteur
        driver.currentVehicle = device.deviceId;
        driver.status = 'active';

        // Ajouter à l'historique
        device.addToHistory('assignation', `Assigné au conducteur ${driver.name}`, driver._id);
        driver.addToHistory('assignation', `Assigné au véhicule ${device.name}`, device.deviceId);

        res.json(device);
    } catch (error) {
        console.error('Erreur lors de l\'assignation du conducteur:', error);
        res.status(400).json({ message: 'Erreur lors de l\'assignation du conducteur' });
    }
};

// Obtenir l'historique d'un appareil
exports.getDeviceHistory = async (req, res) => {
    try {
        const device = testDevices.find(
            d => d.deviceId === req.params.id && d.user === req.user.userId
        );

        if (!device) {
            return res.status(404).json({ message: 'Appareil non trouvé' });
        }

        res.json(device.history);
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'historique:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
}; 