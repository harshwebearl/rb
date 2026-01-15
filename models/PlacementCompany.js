const mongoose = require('mongoose');

const placementCompanySchema = new mongoose.Schema({
  industry_name: {
    type: String,
    required: true,
    trim: true
  },
  industry_photo: {
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

module.exports = mongoose.model('PlacementCompany', placementCompanySchema);