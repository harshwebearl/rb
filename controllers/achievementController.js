const Achievement = require('../models/Achievement');

// @desc    Create a new achievement
// @route   POST /api/achievements
// @access  Private
const createAchievement = async (req, res) => {
  try {
    const { label, value, suffix } = req.body;

    if (!label || !value) {
      return res.status(400).json({ message: 'Label and value are required' });
    }

    const achievement = await Achievement.create({
      label,
      value,
      suffix: suffix || ''
    });

    res.status(201).json(achievement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all achievements
// @route   GET /api/achievements
// @access  Public
const getAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find({});
    res.json(achievements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single achievement
// @route   GET /api/achievements/:id
// @access  Public
const getAchievement = async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id);
    if (achievement) {
      res.json(achievement);
    } else {
      res.status(404).json({ message: 'Achievement not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update achievement
// @route   PUT /api/achievements/:id
// @access  Private
const updateAchievement = async (req, res) => {
  try {
    const { label, value, suffix } = req.body;

    const achievement = await Achievement.findById(req.params.id);
    if (!achievement) {
      return res.status(404).json({ message: 'Achievement not found' });
    }

    achievement.label = label || achievement.label;
    achievement.value = value || achievement.value;
    achievement.suffix = suffix !== undefined ? suffix : achievement.suffix;

    const updatedAchievement = await achievement.save();
    res.json(updatedAchievement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete achievement
// @route   DELETE /api/achievements/:id
// @access  Private
const deleteAchievement = async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id);
    if (!achievement) {
      return res.status(404).json({ message: 'Achievement not found' });
    }

    await achievement.deleteOne();
    res.json({ message: 'Achievement removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createAchievement,
  getAchievements,
  getAchievement,
  updateAchievement,
  deleteAchievement
};