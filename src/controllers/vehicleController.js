const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');

// Créer un nouveau véhicule
exports.createVehicle = async (req, res) => {
    try {
        const vehicle = new Vehicle({
            ...req.body,
            company: req.user.companyId // Assurez-vous que l'utilisateur a accès à la company
        });
        await vehicle.save();
        res.status(201).json(vehicle);
    } catch (error) {
        console.error('Erreur lors de la création du véhicule:', error);
        res.status(400).json({ message: 'Erreur lors de la création du véhicule' });
    }
};

// Obtenir tous les véhicules de l'entreprise
exports.getVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.find({ company: req.user.companyId })
            .populate('currentDriver', 'firstName lastName')
            .sort({ createdAt: -1 });
        res.json(vehicles);
    } catch (error) {
        console.error('Erreur lors de la récupération des véhicules:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Obtenir un véhicule spécifique
exports.getVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findOne({
            _id: req.params.id,
            company: req.user.companyId
        }).populate('currentDriver', 'firstName lastName');

        if (!vehicle) {
            return res.status(404).json({ message: 'Véhicule non trouvé' });
        }

        res.json(vehicle);
    } catch (error) {
        console.error('Erreur lors de la récupération du véhicule:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Mettre à jour un véhicule
exports.updateVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findOneAndUpdate(
            {
                _id: req.params.id,
                company: req.user.companyId
            },
            req.body,
            { new: true, runValidators: true }
        );

        if (!vehicle) {
            return res.status(404).json({ message: 'Véhicule non trouvé' });
        }

        res.json(vehicle);
    } catch (error) {
        console.error('Erreur lors de la mise à jour du véhicule:', error);
        res.status(400).json({ message: 'Erreur lors de la mise à jour du véhicule' });
    }
};

// Supprimer un véhicule
exports.deleteVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findOneAndDelete({
            _id: req.params.id,
            company: req.user.companyId
        });

        if (!vehicle) {
            return res.status(404).json({ message: 'Véhicule non trouvé' });
        }

        // Si le véhicule était assigné à un conducteur, mettre à jour le statut du conducteur
        if (vehicle.currentDriver) {
            await Driver.findByIdAndUpdate(vehicle.currentDriver, {
                currentVehicle: null,
                status: 'disponible'
            });
        }

        res.json({ message: 'Véhicule supprimé avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression du véhicule:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Mettre à jour la position d'un véhicule
exports.updateLocation = async (req, res) => {
    try {
        const { latitude, longitude } = req.body;
        const vehicle = await Vehicle.findOne({
            _id: req.params.id,
            company: req.user.companyId
        });

        if (!vehicle) {
            return res.status(404).json({ message: 'Véhicule non trouvé' });
        }

        await vehicle.updateLocation(latitude, longitude);
        res.json(vehicle);
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la position:', error);
        res.status(400).json({ message: 'Erreur lors de la mise à jour de la position' });
    }
};

// Assigner un conducteur à un véhicule
exports.assignDriver = async (req, res) => {
    try {
        const { driverId } = req.body;
        const vehicle = await Vehicle.findOne({
            _id: req.params.id,
            company: req.user.companyId
        });

        if (!vehicle) {
            return res.status(404).json({ message: 'Véhicule non trouvé' });
        }

        const driver = await Driver.findOne({
            _id: driverId,
            company: req.user.companyId
        });

        if (!driver) {
            return res.status(404).json({ message: 'Conducteur non trouvé' });
        }

        // Mettre à jour le véhicule
        vehicle.currentDriver = driverId;
        vehicle.status = 'en_service';
        await vehicle.save();

        // Mettre à jour le conducteur
        await driver.assignVehicle(vehicle._id);

        // Ajouter à l'historique
        await vehicle.addToHistory('assignation', `Assigné au conducteur ${driver.firstName} ${driver.lastName}`, driverId);
        await driver.addToHistory('assignation', `Assigné au véhicule ${vehicle.name}`, vehicle._id);

        res.json(vehicle);
    } catch (error) {
        console.error('Erreur lors de l\'assignation du conducteur:', error);
        res.status(400).json({ message: 'Erreur lors de l\'assignation du conducteur' });
    }
};

// Obtenir l'historique d'un véhicule
exports.getVehicleHistory = async (req, res) => {
    try {
        const vehicle = await Vehicle.findOne({
            _id: req.params.id,
            company: req.user.companyId
        }).populate('history.driver', 'firstName lastName');

        if (!vehicle) {
            return res.status(404).json({ message: 'Véhicule non trouvé' });
        }

        res.json(vehicle.history);
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'historique:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
}; 