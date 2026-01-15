const Stats = require('../models/Stats');

// Create Stats
exports.createStats = async (req, res) => {
  try {
    const { title, value, description, icon } = req.body;

    // Validation
    if (!title || !value) {
      return res.status(400).json({
        success: false,
        message: 'Title and value are required'
      });
    }

    const stats = new Stats({
      title,
      value,
      description,
      icon
    });

    await stats.save();

    res.status(201).json({
      success: true,
      message: 'Stats created successfully',
      data: stats
    });
  } catch (error) {
    console.error('Error creating stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get All Stats
exports.getAllStats = async (req, res) => {
  try {
    const stats = await Stats.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: stats.length,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get Single Stats
exports.getStatsById = async (req, res) => {
  try {
    const stats = await Stats.findById(req.params.id);

    if (!stats) {
      return res.status(404).json({
        success: false,
        message: 'Stats not found'
      });
    }

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Update Stats
exports.updateStats = async (req, res) => {
  try {
    const { title, value, description, icon } = req.body;

    const stats = await Stats.findByIdAndUpdate(
      req.params.id,
      { title, value, description, icon },
      { new: true, runValidators: true }
    );

    if (!stats) {
      return res.status(404).json({
        success: false,
        message: 'Stats not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Stats updated successfully',
      data: stats
    });
  } catch (error) {
    console.error('Error updating stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Delete Stats
exports.deleteStats = async (req, res) => {
  try {
    const stats = await Stats.findByIdAndDelete(req.params.id);

    if (!stats) {
      return res.status(404).json({
        success: false,
        message: 'Stats not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Stats deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};