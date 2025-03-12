const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
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
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
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
        }
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'maintenance'],
        default: 'active'
    },
    batteryLevel: {
        type: Number,
        min: 0,
        max: 100,
        default: 100
    },
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
            }
        }
    }
}, {
    timestamps: true
});

// Index pour les requêtes géographiques
deviceSchema.index({ 'lastLocation.latitude': 1, 'lastLocation.longitude': 1 });

const Device = mongoose.model('Device', deviceSchema);

module.exports = Device; 