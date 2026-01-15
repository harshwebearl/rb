const mongoose = require('mongoose');

const aboutSectionSchema = new mongoose.Schema({
  section_label: {
    type: String,
    required: true,
    trim: true
  },
  main_heading: {
    type: String,
    required: true,
    trim: true
  },
  description_paragraph_1: {
    type: String,
    required: true,
    trim: true
  },
  description_paragraph_2: {
    type: String,
    trim: true,
    default: ''
  },
  about_image: {
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

module.exports = mongoose.model('AboutSection', aboutSectionSchema);