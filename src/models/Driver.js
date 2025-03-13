const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
    // Informations personnelles
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: true
    },
    
    // Informations professionnelles
    licenseNumber: {
        type: String,
        required: true,
        unique: true
    },
    licenseType: {
        type: String,
        required: true,
        enum: ['A', 'B', 'C', 'D', 'E']
    },
    licenseExpiryDate: {
        type: Date,
        required: true
    },
    hireDate: {
        type: Date,
        required: true
    },
    
    // État actuel
    status: {
        type: String,
        enum: ['disponible', 'en_cours', 'en_pause', 'hors_service'],
        default: 'disponible'
    },
    currentVehicle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle'
    },
    
    // Documents
    documents: [{
        type: {
            type: String,
            enum: ['permis', 'carte_identité', 'contrat', 'formation', 'autre']
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
    
    // Statistiques
    statistics: {
        totalTrips: {
            type: Number,
            default: 0
        },
        totalDistance: {
            type: Number,
            default: 0
        },
        averageSpeed: {
            type: Number,
            default: 0
        },
        incidents: {
            type: Number,
            default: 0
        }
    },
    
    // Historique
    history: [{
        date: Date,
        event: String,
        description: String,
        vehicle: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Vehicle'
        }
    }]
}, {
    timestamps: true
});

// Méthodes
driverSchema.methods.updateStatus = async function(newStatus) {
    this.status = newStatus;
    await this.save();
};

driverSchema.methods.assignVehicle = async function(vehicleId) {
    this.currentVehicle = vehicleId;
    this.status = 'en_cours';
    await this.save();
};

driverSchema.methods.addToHistory = async function(event, description, vehicleId) {
    this.history.push({
        date: new Date(),
        event,
        description,
        vehicle: vehicleId
    });
    await this.save();
};

const Driver = mongoose.model('Driver', driverSchema);

module.exports = Driver; 