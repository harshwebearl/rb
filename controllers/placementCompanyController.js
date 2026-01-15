const PlacementCompany = require('../models/PlacementCompany');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// @desc    Upload and create placement company
// @route   POST /api/placement-companies
// @access  Private
const createPlacementCompany = async (req, res) => {
  try {
    const { industry_name } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'No photo file uploaded' });
    }

    if (!industry_name) {
      return res.status(400).json({ message: 'Industry name is required' });
    }

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(file.path, {
      folder: 'placement-companies'
    });

    // Create placement company
    const placementCompany = await PlacementCompany.create({
      industry_name,
      industry_photo: uploadResult.secure_url,
      public_id: uploadResult.public_id
    });

    res.status(201).json(placementCompany);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all placement companies
// @route   GET /api/placement-companies
// @access  Public
const getPlacementCompanies = async (req, res) => {
  try {
    const placementCompanies = await PlacementCompany.find({});
    res.json(placementCompanies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single placement company
// @route   GET /api/placement-companies/:id
// @access  Public
const getPlacementCompany = async (req, res) => {
  try {
    const placementCompany = await PlacementCompany.findById(req.params.id);
    if (placementCompany) {
      res.json(placementCompany);
    } else {
      res.status(404).json({ message: 'Placement company not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update placement company
// @route   PUT /api/placement-companies/:id
// @access  Private
const updatePlacementCompany = async (req, res) => {
  try {
    const { industry_name } = req.body;
    const file = req.file;

    const placementCompany = await PlacementCompany.findById(req.params.id);
    if (!placementCompany) {
      return res.status(404).json({ message: 'Placement company not found' });
    }

    let updateData = {};

    if (industry_name) {
      updateData.industry_name = industry_name;
    }

    if (file) {
      // Delete old photo from Cloudinary
      await cloudinary.uploader.destroy(placementCompany.public_id);

      // Upload new photo
      const uploadResult = await cloudinary.uploader.upload(file.path, {
        folder: 'placement-companies'
      });

      updateData.industry_photo = uploadResult.secure_url;
      updateData.public_id = uploadResult.public_id;
    }

    const updatedCompany = await PlacementCompany.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updatedCompany);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete placement company
// @route   DELETE /api/placement-companies/:id
// @access  Private
const deletePlacementCompany = async (req, res) => {
  try {
    const placementCompany = await PlacementCompany.findById(req.params.id);
    if (!placementCompany) {
      return res.status(404).json({ message: 'Placement company not found' });
    }

    // Delete photo from Cloudinary
    await cloudinary.uploader.destroy(placementCompany.public_id);

    // Delete from database
    await placementCompany.deleteOne();
    res.json({ message: 'Placement company removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPlacementCompany,
  getPlacementCompanies,
  getPlacementCompany,
  updatePlacementCompany,
  deletePlacementCompany
};