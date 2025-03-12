const mongoose = require('mongoose');

const alertRuleSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['battery', 'speed', 'geofence', 'offline']
  },
  name: {
    type: String,
    required: true
  },
  threshold: {
    type: Number,
    required: true
  },
  enabled: {
    type: Boolean,
    default: true
  },
  notifyBy: [{
    type: String,
    enum: ['app', 'email', 'sms']
  }],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

const alertHistorySchema = new mongoose.Schema({
  deviceId: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['battery', 'speed', 'geofence', 'offline']
  },
  message: {
    type: String,
    required: true
  },
  severity: {
    type: String,
    required: true,
    enum: ['error', 'warning', 'success']
  },
  status: {
    type: String,
    default: 'unread',
    enum: ['read', 'unread']
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

const AlertRule = mongoose.model('AlertRule', alertRuleSchema);
const AlertHistory = mongoose.model('AlertHistory', alertHistorySchema);

module.exports = { AlertRule, AlertHistory }; 