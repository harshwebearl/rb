const mongoose = require('mongoose');

const planSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Plan title is required'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    oldPrice: {
      type: Number,
      required: [true, 'Old price is required'],
      min: [0, 'Price cannot be negative'],
    },
    newPrice: {
      type: Number,
      required: [true, 'New price is required'],
      min: [0, 'Price cannot be negative'],
    },
    note: {
      type: String,
      trim: true,
      maxlength: [500, 'Note cannot be more than 500 characters'],
    },
    features: [
      {
        type: String,
        trim: true,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Plan', planSchema);
