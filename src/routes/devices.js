const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/deviceController');
const { auth } = require('../middleware/auth');

// Toutes les routes nécessitent une authentification
router.use(auth);

// Routes CRUD
router.post('/', deviceController.createDevice);
router.get('/', deviceController.getDevices);
router.get('/:id', deviceController.getDevice);
router.put('/:id', deviceController.updateDevice);
router.delete('/:id', deviceController.deleteDevice);

// Route pour mettre à jour la position
router.post('/:id/location', deviceController.updateLocation);

module.exports = router; 