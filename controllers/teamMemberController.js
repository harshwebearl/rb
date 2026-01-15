const TeamMember = require('../models/TeamMember');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// @desc    Upload and create team member
// @route   POST /api/team-members
// @access  Private
const createTeamMember = async (req, res) => {
  try {
    const { name, role, linkedin_url, email } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'No image file uploaded' });
    }

    if (!name || !role || !email) {
      return res.status(400).json({ message: 'Name, role, and email are required' });
    }

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(file.path, {
      folder: 'team-members'
    });

    // Create team member
    const teamMember = await TeamMember.create({
      name,
      role,
      linkedin_url: linkedin_url || '',
      email,
      person_image: uploadResult.secure_url,
      public_id: uploadResult.public_id
    });

    res.status(201).json(teamMember);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all team members
// @route   GET /api/team-members
// @access  Public
const getTeamMembers = async (req, res) => {
  try {
    const teamMembers = await TeamMember.find({});
    res.json(teamMembers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single team member
// @route   GET /api/team-members/:id
// @access  Public
const getTeamMember = async (req, res) => {
  try {
    const teamMember = await TeamMember.findById(req.params.id);
    if (teamMember) {
      res.json(teamMember);
    } else {
      res.status(404).json({ message: 'Team member not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update team member
// @route   PUT /api/team-members/:id
// @access  Private
const updateTeamMember = async (req, res) => {
  try {
    const { name, role, linkedin_url, email } = req.body;
    const file = req.file;

    const teamMember = await TeamMember.findById(req.params.id);
    if (!teamMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }

    let updateData = {};

    if (name) updateData.name = name;
    if (role) updateData.role = role;
    if (linkedin_url !== undefined) updateData.linkedin_url = linkedin_url;
    if (email) updateData.email = email;

    if (file) {
      // Delete old image from Cloudinary
      await cloudinary.uploader.destroy(teamMember.public_id);

      // Upload new image
      const uploadResult = await cloudinary.uploader.upload(file.path, {
        folder: 'team-members'
      });

      updateData.person_image = uploadResult.secure_url;
      updateData.public_id = uploadResult.public_id;
    }

    const updatedMember = await TeamMember.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updatedMember);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete team member
// @route   DELETE /api/team-members/:id
// @access  Private
const deleteTeamMember = async (req, res) => {
  try {
    const teamMember = await TeamMember.findById(req.params.id);
    if (!teamMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }

    // Delete image from Cloudinary
    await cloudinary.uploader.destroy(teamMember.public_id);

    // Delete from database
    await teamMember.deleteOne();
    res.json({ message: 'Team member removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTeamMember,
  getTeamMembers,
  getTeamMember,
  updateTeamMember,
  deleteTeamMember
};