const Service = require('../models/Service');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// @desc    Upload and create service
// @route   POST /api/services
// @access  Private
const createService = async (req, res) => {
  try {
    console.log('req.body:', req.body);
    console.log('req.files:', req.files);
    const { service_title, short_description, main_description, additional_description, key_points } = req.body;
    let parsedKeyPoints = [];
    if (key_points) {
      try {
        parsedKeyPoints = typeof key_points === 'string' ? JSON.parse(key_points) : key_points;
      } catch (e) {
        return res.status(400).json({ message: 'Invalid key_points format' });
      }
    }
    const file = req.files.image && req.files.image[0] || req.files.file && req.files.file[0] || req.files.service_image && req.files.service_image[0];

    if (!file) {
      return res.status(400).json({ message: 'No image file uploaded' });
    }

    if (!service_title || !short_description || !main_description) {
      return res.status(400).json({ message: 'Service title, short description, and main description are required' });
    }

    if (parsedKeyPoints && parsedKeyPoints.length > 6) {
      return res.status(400).json({ message: 'Key points cannot exceed 6 items' });
    }

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(file.path, {
      folder: 'services'
    });

    // Create service
    const service = await Service.create({
      service_title,
      short_description,
      main_description,
      additional_description: additional_description || '',
      key_points: parsedKeyPoints || [],
      service_image: uploadResult.secure_url,
      public_id: uploadResult.public_id
    });

    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all services
// @route   GET /api/services
// @access  Public
const getServices = async (req, res) => {
  try {
    const services = await Service.find({});
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single service
// @route   GET /api/services/:id
// @access  Public
const getService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (service) {
      res.json(service);
    } else {
      res.status(404).json({ message: 'Service not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Private
const updateService = async (req, res) => {
  try {
    const { service_title, short_description, main_description, additional_description, key_points } = req.body;
    let parsedKeyPoints = key_points;
    if (key_points !== undefined) {
      try {
        parsedKeyPoints = typeof key_points === 'string' ? JSON.parse(key_points) : key_points;
      } catch (e) {
        return res.status(400).json({ message: 'Invalid key_points format' });
      }
    }
    const file = req.files.image && req.files.image[0] || req.files.file && req.files.file[0] || req.files.service_image && req.files.service_image[0];

    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    if (parsedKeyPoints && parsedKeyPoints.length > 6) {
      return res.status(400).json({ message: 'Key points cannot exceed 6 items' });
    }

    let updateData = {};

    if (service_title) updateData.service_title = service_title;
    if (short_description) updateData.short_description = short_description;
    if (main_description) updateData.main_description = main_description;
    if (additional_description !== undefined) updateData.additional_description = additional_description;
    if (parsedKeyPoints !== undefined) updateData.key_points = parsedKeyPoints;

    if (file) {
      // Delete old image from Cloudinary
      await cloudinary.uploader.destroy(service.public_id);

      // Upload new image
      const uploadResult = await cloudinary.uploader.upload(file.path, {
        folder: 'services'
      });

      updateData.service_image = uploadResult.secure_url;
      updateData.public_id = uploadResult.public_id;
    }

    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updatedService);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Private
const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Delete image from Cloudinary
    await cloudinary.uploader.destroy(service.public_id);

    // Delete from database
    await service.deleteOne();
    res.json({ message: 'Service removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createService,
  getServices,
  getService,
  updateService,
  deleteService
};