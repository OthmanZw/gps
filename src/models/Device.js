const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
    // Informations de base
    name: {
        type: String,
        required: true,
        trim: true
    },
    deviceId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        enum: ['voiture', 'camion', 'van', 'moto', 'container', 'autre']
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
    
    // Propriétaire et appartenance
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'
    },
    
    // Localisation
    lastLocation: {
        latitude: {
            type: Number,
            default: 0
        },
        longitude: {
            type: Number,
            default: 0
        },
        timestamp: {
            type: Date,
            default: Date.now
        },
        speed: {
            type: Number,
            default: 0
        },
        heading: {
            type: Number,
            default: 0
        }
    },
    
    // État et maintenance
    status: {
        type: String,
        enum: ['active', 'inactive', 'maintenance', 'hors_service', 'réservé'],
        default: 'active'
    },
    batteryLevel: {
        type: Number,
        min: 0,
        max: 100,
        default: 100
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
    
    // Conducteur actuel
    currentDriver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Driver'
    },
    
    // Statistiques
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
    
    // Paramètres
    settings: {
        updateInterval: {
            type: Number,
            default: 300, // 5 minutes in seconds
            min: 30 // minimum 30 seconds
        },
        alerts: {
            lowBattery: {
                type: Boolean,
                default: true
            },
            geofence: {
                type: Boolean,
                default: false
            },
            speedLimit: {
                type: Boolean,
                default: false
            },
            maintenance: {
                type: Boolean,
                default: true
            }
        }
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

// Index pour les requêtes géographiques
deviceSchema.index({ 'lastLocation.latitude': 1, 'lastLocation.longitude': 1 });

// Méthodes
deviceSchema.methods.updateLocation = async function(latitude, longitude, speed, heading) {
    this.lastLocation = {
        latitude,
        longitude,
        speed,
        heading,
        timestamp: new Date()
    };
    await this.save();
};

deviceSchema.methods.addToHistory = async function(event, description, driverId) {
    this.history.push({
        date: new Date(),
        event,
        description,
        driver: driverId
    });
    await this.save();
};

const Device = mongoose.model('Device', deviceSchema);

module.exports = Device; 