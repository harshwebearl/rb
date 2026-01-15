const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    required: true,
    trim: true
  },
  linkedin_url: {
    type: String,
    trim: true,
    default: ''
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  person_image: {
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

module.exports = mongoose.model('TeamMember', teamMemberSchema);