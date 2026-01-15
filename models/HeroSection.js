const mongoose = require('mongoose');

const heroSectionSchema = new mongoose.Schema({
  main_heading: {
    type: String,
    required: true,
    trim: true
  },
  highlight_text_1: {
    type: String,
    required: true,
    trim: true
  },
  highlight_text_2: {
    type: String,
    trim: true,
    default: ''
  },
  description_line_1: {
    type: String,
    required: true,
    trim: true
  },
  description_line_2: {
    type: String,
    trim: true,
    default: ''
  },
  hero_image: {
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

module.exports = mongoose.model('HeroSection', heroSectionSchema);