const Industry = require('../models/Industry');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// @desc    Upload and create industry item
// @route   POST /api/industries
// @access  Private
const createIndustry = async (req, res) => {
  try {
    const { industry_name, description } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'No image file uploaded' });
    }

    if (!industry_name || !description) {
      return res.status(400).json({ message: 'Industry name and description are required' });
    }

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(file.path, {
      folder: 'industries'
    });

    // Create industry item
    const industry = await Industry.create({
      industry_name,
      description,
      industry_image: uploadResult.secure_url,
      public_id: uploadResult.public_id
    });

    res.status(201).json(industry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all industries
// @route   GET /api/industries
// @access  Public
const getIndustries = async (req, res) => {
  try {
    const industries = await Industry.find({});
    res.json(industries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single industry
// @route   GET /api/industries/:id
// @access  Public
const getIndustry = async (req, res) => {
  try {
    const industry = await Industry.findById(req.params.id);
    if (industry) {
      res.json(industry);
    } else {
      res.status(404).json({ message: 'Industry not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update industry
// @route   PUT /api/industries/:id
// @access  Private
const updateIndustry = async (req, res) => {
  try {
    const { industry_name, description } = req.body;
    const file = req.file;

    const industry = await Industry.findById(req.params.id);
    if (!industry) {
      return res.status(404).json({ message: 'Industry not found' });
    }

    let updateData = {};

    if (industry_name) {
      updateData.industry_name = industry_name;
    }

    if (description) {
      updateData.description = description;
    }

    if (file) {
      // Delete old image from Cloudinary
      await cloudinary.uploader.destroy(industry.public_id);

      // Upload new image
      const uploadResult = await cloudinary.uploader.upload(file.path, {
        folder: 'industries'
      });

      updateData.industry_image = uploadResult.secure_url;
      updateData.public_id = uploadResult.public_id;
    }

    const updatedIndustry = await Industry.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updatedIndustry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete industry
// @route   DELETE /api/industries/:id
// @access  Private
const deleteIndustry = async (req, res) => {
  try {
    const industry = await Industry.findById(req.params.id);
    if (!industry) {
      return res.status(404).json({ message: 'Industry not found' });
    }

    // Delete image from Cloudinary
    await cloudinary.uploader.destroy(industry.public_id);

    // Delete from database
    await industry.deleteOne();
    res.json({ message: 'Industry removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createIndustry,
  getIndustries,
  getIndustry,
  updateIndustry,
  deleteIndustry
};