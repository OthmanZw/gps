const Device = require('../models/Device');
const Driver = require('../models/Driver');

// Créer un nouvel appareil/véhicule
exports.createDevice = async (req, res) => {
    try {
        const deviceData = {
            ...req.body,
            user: req.user._id,
            type: 'voiture',
            brand: 'Test Brand',
            model: 'Test Model',
            year: 2024,
            registrationNumber: 'TEST-001',
            fuelType: 'électrique',
            status: 'active'
        };

        const device = new Device(deviceData);
        await device.save();

        res.status(201).json(device);
    } catch (error) {
        console.error('Erreur lors de la création de l\'appareil:', error);
        res.status(400).json({ message: 'Erreur lors de la création de l\'appareil', error: error.message });
    }
};

// Obtenir tous les appareils de l'entreprise
exports.getDevices = async (req, res) => {
    try {
        const devices = await Device.find({ user: req.user._id })
            .populate('currentDriver', 'firstName lastName')
            .sort({ createdAt: -1 });
        res.json(devices);
    } catch (error) {
        console.error('Erreur lors de la récupération des appareils:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Obtenir un appareil spécifique
exports.getDevice = async (req, res) => {
    try {
        const device = await Device.findOne({
            deviceId: req.params.id,
            user: req.user._id
        }).populate('currentDriver', 'firstName lastName');

        if (!device) {
            return res.status(404).json({ message: 'Appareil non trouvé' });
        }

        res.json(device);
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'appareil:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Mettre à jour un appareil
exports.updateDevice = async (req, res) => {
    try {
        const device = await Device.findOneAndUpdate(
            {
                deviceId: req.params.id,
                user: req.user._id
            },
            req.body,
            { new: true, runValidators: true }
        );

        if (!device) {
            return res.status(404).json({ message: 'Appareil non trouvé' });
        }

        res.json(device);
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'appareil:', error);
        res.status(400).json({ message: 'Erreur lors de la mise à jour de l\'appareil' });
    }
};

// Supprimer un appareil
exports.deleteDevice = async (req, res) => {
    try {
        const device = await Device.findOneAndDelete({
            deviceId: req.params.id,
            user: req.user._id
        });

        if (!device) {
            return res.status(404).json({ message: 'Appareil non trouvé' });
        }

        // Si l'appareil était assigné à un conducteur, mettre à jour le statut du conducteur
        if (device.currentDriver) {
            await Driver.findByIdAndUpdate(device.currentDriver, {
                currentVehicle: null,
                status: 'disponible'
            });
        }

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
        const device = await Device.findOne({
            deviceId: req.params.id,
            user: req.user._id
        });

        if (!device) {
            return res.status(404).json({ message: 'Appareil non trouvé' });
        }

        await device.updateLocation(latitude, longitude, speed, heading);
        res.json(device);
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la position:', error);
        res.status(400).json({ message: 'Erreur lors de la mise à jour de la position' });
    }
};

// Assigner un conducteur à un appareil
exports.assignDriver = async (req, res) => {
    try {
        const { driverId } = req.body;
        const device = await Device.findOne({
            deviceId: req.params.id,
            user: req.user._id
        });

        if (!device) {
            return res.status(404).json({ message: 'Appareil non trouvé' });
        }

        const driver = await Driver.findOne({
            _id: driverId,
            user: req.user._id
        });

        if (!driver) {
            return res.status(404).json({ message: 'Conducteur non trouvé' });
        }

        // Mettre à jour l'appareil
        device.currentDriver = driverId;
        device.status = 'active';
        await device.save();

        // Mettre à jour le conducteur
        await driver.assignVehicle(device._id);

        // Ajouter à l'historique
        await device.addToHistory('assignation', `Assigné au conducteur ${driver.firstName} ${driver.lastName}`, driverId);
        await driver.addToHistory('assignation', `Assigné au véhicule ${device.name}`, device._id);

        res.json(device);
    } catch (error) {
        console.error('Erreur lors de l\'assignation du conducteur:', error);
        res.status(400).json({ message: 'Erreur lors de l\'assignation du conducteur' });
    }
};

// Obtenir l'historique d'un appareil
exports.getDeviceHistory = async (req, res) => {
    try {
        const device = await Device.findOne({
            deviceId: req.params.id,
            user: req.user._id
        }).populate('history.driver', 'firstName lastName');

        if (!device) {
            return res.status(404).json({ message: 'Appareil non trouvé' });
        }

        res.json(device.history);
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'historique:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
}; 