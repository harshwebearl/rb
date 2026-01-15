const Job = require('../models/Job');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// @desc    Upload and create job
// @route   POST /api/jobs
// @access  Private
const createJob = async (req, res) => {
  try {
    const {
      job_title,
      slug,
      category,
      job_type,
      city,
      state,
      country,
      experience,
      short_description,
      detailed_description,
      responsibilities,
      requirements
    } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'No image file uploaded' });
    }

    const requiredFields = [
      job_title, slug, category, job_type, city, state, country,
      experience, short_description, detailed_description
    ];

    if (requiredFields.some(field => !field)) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    if (responsibilities && responsibilities.length > 6) {
      return res.status(400).json({ message: 'Responsibilities cannot exceed 6 items' });
    }

    if (requirements && requirements.length > 6) {
      return res.status(400).json({ message: 'Requirements cannot exceed 6 items' });
    }

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(file.path, {
      folder: 'jobs'
    });

    // Create job
    const job = await Job.create({
      job_title,
      slug,
      category,
      job_type,
      city,
      state,
      country,
      experience,
      short_description,
      detailed_description,
      responsibilities: responsibilities || [],
      requirements: requirements || [],
      job_image: uploadResult.secure_url,
      public_id: uploadResult.public_id
    });

    res.status(201).json(job);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Slug already exists' });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({});
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
const getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (job) {
      res.json(job);
    } else {
      res.status(404).json({ message: 'Job not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get job by slug
// @route   GET /api/jobs/slug/:slug
// @access  Public
const getJobBySlug = async (req, res) => {
  try {
    const job = await Job.findOne({ slug: req.params.slug });
    if (job) {
      res.json(job);
    } else {
      res.status(404).json({ message: 'Job not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private
const updateJob = async (req, res) => {
  try {
    const {
      job_title,
      slug,
      category,
      job_type,
      city,
      state,
      country,
      experience,
      short_description,
      detailed_description,
      responsibilities,
      requirements
    } = req.body;
    const file = req.file;

    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (responsibilities && responsibilities.length > 6) {
      return res.status(400).json({ message: 'Responsibilities cannot exceed 6 items' });
    }

    if (requirements && requirements.length > 6) {
      return res.status(400).json({ message: 'Requirements cannot exceed 6 items' });
    }

    let updateData = {};

    if (job_title) updateData.job_title = job_title;
    if (slug) updateData.slug = slug;
    if (category) updateData.category = category;
    if (job_type) updateData.job_type = job_type;
    if (city) updateData.city = city;
    if (state) updateData.state = state;
    if (country) updateData.country = country;
    if (experience) updateData.experience = experience;
    if (short_description) updateData.short_description = short_description;
    if (detailed_description) updateData.detailed_description = detailed_description;
    if (responsibilities !== undefined) updateData.responsibilities = responsibilities;
    if (requirements !== undefined) updateData.requirements = requirements;

    if (file) {
      // Delete old image from Cloudinary
      await cloudinary.uploader.destroy(job.public_id);

      // Upload new image
      const uploadResult = await cloudinary.uploader.upload(file.path, {
        folder: 'jobs'
      });

      updateData.job_image = uploadResult.secure_url;
      updateData.public_id = uploadResult.public_id;
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updatedJob);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Slug already exists' });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Delete image from Cloudinary
    await cloudinary.uploader.destroy(job.public_id);

    // Delete from database
    await job.deleteOne();
    res.json({ message: 'Job removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createJob,
  getJobs,
  getJob,
  getJobBySlug,
  updateJob,
  deleteJob
};