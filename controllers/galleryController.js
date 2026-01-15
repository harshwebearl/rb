const Gallery = require('../models/Gallery');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// @desc    Upload and create gallery item
// @route   POST /api/gallery
// @access  Private
const createGalleryItem = async (req, res) => {
  try {
    const { gallery_name } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    if (!gallery_name) {
      return res.status(400).json({ message: 'Gallery name is required' });
    }

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(file.path, {
      folder: 'gallery'
    });

    // Create gallery item
    const galleryItem = await Gallery.create({
      gallery_name,
      gallery_photo: uploadResult.secure_url,
      public_id: uploadResult.public_id
    });

    res.status(201).json(galleryItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all gallery items
// @route   GET /api/gallery
// @access  Public
const getGalleryItems = async (req, res) => {
  try {
    const galleryItems = await Gallery.find({});
    res.json(galleryItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single gallery item
// @route   GET /api/gallery/:id
// @access  Public
const getGalleryItem = async (req, res) => {
  try {
    const galleryItem = await Gallery.findById(req.params.id);
    if (galleryItem) {
      res.json(galleryItem);
    } else {
      res.status(404).json({ message: 'Gallery item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update gallery item
// @route   PUT /api/gallery/:id
// @access  Private
const updateGalleryItem = async (req, res) => {
  try {
    const { gallery_name } = req.body;
    const file = req.file;

    const galleryItem = await Gallery.findById(req.params.id);
    if (!galleryItem) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }

    let updateData = {};

    if (gallery_name) {
      updateData.gallery_name = gallery_name;
    }

    if (file) {
      // Delete old image from Cloudinary
      await cloudinary.uploader.destroy(galleryItem.public_id);

      // Upload new image
      const uploadResult = await cloudinary.uploader.upload(file.path, {
        folder: 'gallery'
      });

      updateData.gallery_photo = uploadResult.secure_url;
      updateData.public_id = uploadResult.public_id;
    }

    const updatedItem = await Gallery.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete gallery item
// @route   DELETE /api/gallery/:id
// @access  Private
const deleteGalleryItem = async (req, res) => {
  try {
    const galleryItem = await Gallery.findById(req.params.id);
    if (!galleryItem) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }

    // Delete image from Cloudinary
    await cloudinary.uploader.destroy(galleryItem.public_id);

    // Delete from database
    await galleryItem.deleteOne();
    res.json({ message: 'Gallery item removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createGalleryItem,
  getGalleryItems,
  getGalleryItem,
  updateGalleryItem,
  deleteGalleryItem
};