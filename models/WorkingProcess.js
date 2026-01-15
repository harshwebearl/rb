const mongoose = require('mongoose');

const workingProcessSchema = new mongoose.Schema({
  step_number: {
    type: Number,
    required: true,
    min: 1
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

// Ensure step numbers are unique
workingProcessSchema.index({ step_number: 1 }, { unique: true });

module.exports = mongoose.model('WorkingProcess', workingProcessSchema);