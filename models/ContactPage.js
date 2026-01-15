const mongoose = require('mongoose');

const contactPageSchema = new mongoose.Schema({
  phone_number: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  whatsapp_number: {
    type: String,
    trim: true,
    default: ''
  },
  office_address: {
    type: String,
    required: true,
    trim: true
  },
  google_map_embed: {
    type: String,
    trim: true,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ContactPage', contactPageSchema);