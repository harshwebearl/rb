const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  job_title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  job_type: {
    type: String,
    required: true,
    enum: ['full-time', 'part-time', 'contract', 'freelance', 'internship'],
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    required: true,
    trim: true
  },
  experience: {
    type: String,
    required: true,
    trim: true
  },
  short_description: {
    type: String,
    required: true,
    trim: true
  },
  detailed_description: {
    type: String,
    required: true,
    trim: true
  },
  responsibilities: [{
    type: String,
    trim: true
  }],
  requirements: [{
    type: String,
    trim: true
  }],
  job_image: {
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

// Validation for arrays (max 6)
jobSchema.pre('save', function(next) {
  if (this.responsibilities && this.responsibilities.length > 6) {
    return next(new Error('Responsibilities cannot exceed 6 items'));
  }
  if (this.requirements && this.requirements.length > 6) {
    return next(new Error('Requirements cannot exceed 6 items'));
  }
  next();
});

module.exports = mongoose.model('Job', jobSchema);