const AboutSection = require('../models/AboutSection');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// @desc    Upload and create about section
// @route   POST /api/about-sections
// @access  Private
const createAboutSection = async (req, res) => {
  try {
    const { section_label, main_heading, description_paragraph_1, description_paragraph_2 } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'No image file uploaded' });
    }

    if (!section_label || !main_heading || !description_paragraph_1) {
      return res.status(400).json({ message: 'Section label, main heading, and description paragraph 1 are required' });
    }

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(file.path, {
      folder: 'about-sections'
    });

    // Create about section
    const aboutSection = await AboutSection.create({
      section_label,
      main_heading,
      description_paragraph_1,
      description_paragraph_2: description_paragraph_2 || '',
      about_image: uploadResult.secure_url,
      public_id: uploadResult.public_id
    });

    res.status(201).json(aboutSection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all about sections
// @route   GET /api/about-sections
// @access  Public
const getAboutSections = async (req, res) => {
  try {
    const aboutSections = await AboutSection.find({});
    res.json(aboutSections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single about section
// @route   GET /api/about-sections/:id
// @access  Public
const getAboutSection = async (req, res) => {
  try {
    const aboutSection = await AboutSection.findById(req.params.id);
    if (aboutSection) {
      res.json(aboutSection);
    } else {
      res.status(404).json({ message: 'About section not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update about section
// @route   PUT /api/about-sections/:id
// @access  Private
const updateAboutSection = async (req, res) => {
  try {
    const { section_label, main_heading, description_paragraph_1, description_paragraph_2 } = req.body;
    const file = req.file;

    const aboutSection = await AboutSection.findById(req.params.id);
    if (!aboutSection) {
      return res.status(404).json({ message: 'About section not found' });
    }

    let updateData = {};

    if (section_label) updateData.section_label = section_label;
    if (main_heading) updateData.main_heading = main_heading;
    if (description_paragraph_1) updateData.description_paragraph_1 = description_paragraph_1;
    if (description_paragraph_2 !== undefined) updateData.description_paragraph_2 = description_paragraph_2;

    if (file) {
      // Delete old image from Cloudinary
      await cloudinary.uploader.destroy(aboutSection.public_id);

      // Upload new image
      const uploadResult = await cloudinary.uploader.upload(file.path, {
        folder: 'about-sections'
      });

      updateData.about_image = uploadResult.secure_url;
      updateData.public_id = uploadResult.public_id;
    }

    const updatedSection = await AboutSection.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updatedSection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete about section
// @route   DELETE /api/about-sections/:id
// @access  Private
const deleteAboutSection = async (req, res) => {
  try {
    const aboutSection = await AboutSection.findById(req.params.id);
    if (!aboutSection) {
      return res.status(404).json({ message: 'About section not found' });
    }

    // Delete image from Cloudinary
    await cloudinary.uploader.destroy(aboutSection.public_id);

    // Delete from database
    await aboutSection.deleteOne();
    res.json({ message: 'About section removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createAboutSection,
  getAboutSections,
  getAboutSection,
  updateAboutSection,
  deleteAboutSection
};