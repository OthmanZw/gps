const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    // Informations de base
    name: {
        type: String,
        required: true,
        trim: true
    },
    siret: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        street: String,
        city: String,
        postalCode: String,
        country: String
    },
    phone: String,
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    
    // Informations commerciales
    subscriptionPlan: {
        type: String,
        enum: ['basic', 'professional', 'enterprise'],
        default: 'basic'
    },
    subscriptionStatus: {
        type: String,
        enum: ['active', 'pending', 'suspended', 'cancelled'],
        default: 'pending'
    },
    subscriptionStartDate: Date,
    subscriptionEndDate: Date,
    
    // Configuration
    settings: {
        maxVehicles: {
            type: Number,
            default: 5
        },
        maxDrivers: {
            type: Number,
            default: 10
        },
        features: [{
            type: String,
            enum: [
                'real_time_tracking',
                'maintenance_alerts',
                'driver_management',
                'reports',
                'geofencing',
                'route_optimization'
            ]
        }]
    },
    
    // Contacts
    contacts: [{
        name: String,
        role: String,
        email: String,
        phone: String,
        isPrimary: Boolean
    }],
    
    // Documents
    documents: [{
        type: {
            type: String,
            enum: ['contrat', 'facture', 'autre']
        },
        number: String,
        date: Date,
        fileUrl: String
    }],
    
    // Statistiques
    statistics: {
        totalVehicles: {
            type: Number,
            default: 0
        },
        totalDrivers: {
            type: Number,
            default: 0
        },
        totalTrips: {
            type: Number,
            default: 0
        },
        totalDistance: {
            type: Number,
            default: 0
        }
    }
}, {
    timestamps: true
});

// Méthodes
companySchema.methods.updateSubscription = async function(plan, startDate, endDate) {
    this.subscriptionPlan = plan;
    this.subscriptionStartDate = startDate;
    this.subscriptionEndDate = endDate;
    this.subscriptionStatus = 'active';
    await this.save();
};

companySchema.methods.addContact = async function(contact) {
    this.contacts.push(contact);
    await this.save();
};

companySchema.methods.updateStatistics = async function() {
    const Vehicle = mongoose.model('Vehicle');
    const Driver = mongoose.model('Driver');
    
    const vehicles = await Vehicle.countDocuments({ company: this._id });
    const drivers = await Driver.countDocuments({ company: this._id });
    
    this.statistics.totalVehicles = vehicles;
    this.statistics.totalDrivers = drivers;
    await this.save();
};

const Company = mongoose.model('Company', companySchema);

module.exports = Company; 