const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  service_title: {
    type: String,
    required: true,
    trim: true
  },
  short_description: {
    type: String,
    required: true,
    trim: true
  },
  main_description: {
    type: String,
    required: true,
    trim: true
  },
  additional_description: {
    type: String,
    trim: true,
    default: ''
  },
  key_points: [{
    type: String,
    trim: true
  }],
  service_image: {
    type: String,
    required: true // Cloudinary URL
  },
  public_id: {
    type: String,
    required: true // Cloudinary public_id for deletion
  }
}, {
  timestamps: true
});

// Validation for key_points array (max 6)
serviceSchema.pre('save', function(next) {
  if (this.key_points && this.key_points.length > 6) {
    return next(new Error('Key points cannot exceed 6 items'));
  }
  next();
});

module.exports = mongoose.model('Service', serviceSchema);