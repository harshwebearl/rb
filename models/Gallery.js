const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  gallery_name: {
    type: String,
    required: true,
    trim: true
  },
  gallery_photo: {
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

module.exports = mongoose.model('Gallery', gallerySchema);