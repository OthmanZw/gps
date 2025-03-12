const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    device: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Device',
        required: true
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    speed: {
        type: Number,
        min: 0,
        default: 0
    },
    altitude: {
        type: Number,
        default: 0
    },
    heading: {
        type: Number,
        min: 0,
        max: 360,
        default: 0
    },
    accuracy: {
        type: Number,
        min: 0,
        default: 0
    },
    batteryLevel: {
        type: Number,
        min: 0,
        max: 100
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index pour les requêtes géographiques
locationSchema.index({ latitude: 1, longitude: 1 });
// Index pour les requêtes temporelles
locationSchema.index({ device: 1, timestamp: -1 });

const Location = mongoose.model('Location', locationSchema);

module.exports = Location; 