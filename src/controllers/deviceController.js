const Device = require('../models/Device');

// Créer un nouvel appareil
exports.createDevice = async (req, res) => {
    try {
        const { name, deviceId } = req.body;
        
        // Vérifier si l'appareil existe déjà
        const existingDevice = await Device.findOne({ deviceId });
        if (existingDevice) {
            return res.status(400).json({ message: 'Device ID already exists' });
        }

        // Créer le nouvel appareil
        const device = new Device({
            name,
            deviceId,
            user: req.user.userId // L'ID de l'utilisateur connecté
        });

        await device.save();
        res.status(201).json({
            message: 'Device created successfully',
            device
        });
    } catch (error) {
        console.error('Create device error:', error);
        res.status(500).json({ message: 'Error creating device' });
    }
};

// Obtenir tous les appareils de l'utilisateur
exports.getDevices = async (req, res) => {
    try {
        const devices = await Device.find({ user: req.user.userId });
        res.json(devices);
    } catch (error) {
        console.error('Get devices error:', error);
        res.status(500).json({ message: 'Error fetching devices' });
    }
};

// Obtenir un appareil spécifique
exports.getDevice = async (req, res) => {
    try {
        const device = await Device.findOne({
            deviceId: req.params.id,
            user: req.user.userId
        });

        if (!device) {
            return res.status(404).json({ message: 'Device not found' });
        }

        res.json(device);
    } catch (error) {
        console.error('Get device error:', error);
        res.status(500).json({ message: 'Error fetching device' });
    }
};

// Mettre à jour un appareil
exports.updateDevice = async (req, res) => {
    try {
        const updates = req.body;
        const device = await Device.findOneAndUpdate(
            {
                deviceId: req.params.id,
                user: req.user.userId
            },
            updates,
            { new: true, runValidators: true }
        );

        if (!device) {
            return res.status(404).json({ message: 'Device not found' });
        }

        res.json({
            message: 'Device updated successfully',
            device
        });
    } catch (error) {
        console.error('Update device error:', error);
        res.status(500).json({ message: 'Error updating device' });
    }
};

// Supprimer un appareil
exports.deleteDevice = async (req, res) => {
    try {
        const device = await Device.findOneAndDelete({
            deviceId: req.params.id,
            user: req.user.userId
        });

        if (!device) {
            return res.status(404).json({ message: 'Device not found' });
        }

        res.json({ message: 'Device deleted successfully' });
    } catch (error) {
        console.error('Delete device error:', error);
        res.status(500).json({ message: 'Error deleting device' });
    }
};

// Mettre à jour la position d'un appareil
exports.updateLocation = async (req, res) => {
    try {
        const { latitude, longitude } = req.body;
        
        const device = await Device.findOneAndUpdate(
            {
                deviceId: req.params.id,
                user: req.user.userId
            },
            {
                'lastLocation.coordinates': [longitude, latitude],
                'lastLocation.timestamp': new Date()
            },
            { new: true }
        );

        if (!device) {
            return res.status(404).json({ message: 'Device not found' });
        }

        res.json({
            message: 'Location updated successfully',
            device
        });
    } catch (error) {
        console.error('Update location error:', error);
        res.status(500).json({ message: 'Error updating location' });
    }
}; 