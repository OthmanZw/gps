const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const { auth } = require('../middleware/auth');

// Routes protégées par authentification
router.use(auth);

// Routes pour les véhicules
router.post('/', vehicleController.createVehicle);
router.get('/', vehicleController.getVehicles);
router.get('/:id', vehicleController.getVehicle);
router.put('/:id', vehicleController.updateVehicle);
router.delete('/:id', vehicleController.deleteVehicle);

// Routes spécifiques
router.post('/:id/location', vehicleController.updateLocation);
router.post('/:id/assign-driver', vehicleController.assignDriver);
router.get('/:id/history', vehicleController.getVehicleHistory);

module.exports = router; 