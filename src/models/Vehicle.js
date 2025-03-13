const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    // Informations de base
    name: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        enum: ['voiture', 'camion', 'van', 'moto', 'autre']
    },
    registrationNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    brand: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    
    // Informations techniques
    fuelType: {
        type: String,
        enum: ['essence', 'diesel', 'électrique', 'hybride'],
        required: true
    },
    lastMaintenance: {
        date: Date,
        description: String,
        mileage: Number
    },
    nextMaintenance: {
        date: Date,
        description: String,
        mileage: Number
    },
    
    // État actuel
    status: {
        type: String,
        enum: ['en_service', 'en_maintenance', 'hors_service', 'réservé'],
        default: 'en_service'
    },
    currentDriver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Driver'
    },
    currentLocation: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            default: [0, 0]
        }
    },
    lastUpdate: {
        type: Date,
        default: Date.now
    },
    
    // Informations de suivi
    totalMileage: {
        type: Number,
        default: 0
    },
    fuelConsumption: {
        type: Number,
        default: 0
    },
    
    // Documents
    documents: [{
        type: {
            type: String,
            enum: ['assurance', 'carte_grise', 'contrat', 'autre']
        },
        number: String,
        expiryDate: Date,
        fileUrl: String
    }],
    
    // Appartenance
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    
    // Historique
    history: [{
        date: Date,
        event: String,
        description: String,
        driver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Driver'
        }
    }]
}, {
    timestamps: true
});

// Index pour la recherche géospatiale
vehicleSchema.index({ currentLocation: '2dsphere' });

// Méthodes
vehicleSchema.methods.updateLocation = async function(latitude, longitude) {
    this.currentLocation.coordinates = [longitude, latitude];
    this.lastUpdate = new Date();
    await this.save();
};

vehicleSchema.methods.addToHistory = async function(event, description, driverId) {
    this.history.push({
        date: new Date(),
        event,
        description,
        driver: driverId
    });
    await this.save();
};

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

module.exports = Vehicle; 