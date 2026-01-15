const MissionVision = require('../models/MissionVision');

// @desc    Create a new mission/vision item
// @route   POST /api/mission-vision
// @access  Private
const createMissionVision = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const missionVision = await MissionVision.create({
      title,
      description
    });

    res.status(201).json(missionVision);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all mission/vision items
// @route   GET /api/mission-vision
// @access  Public
const getMissionVisionItems = async (req, res) => {
  try {
    const missionVisionItems = await MissionVision.find({});
    res.json(missionVisionItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single mission/vision item
// @route   GET /api/mission-vision/:id
// @access  Public
const getMissionVisionItem = async (req, res) => {
  try {
    const missionVisionItem = await MissionVision.findById(req.params.id);
    if (missionVisionItem) {
      res.json(missionVisionItem);
    } else {
      res.status(404).json({ message: 'Mission/Vision item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update mission/vision item
// @route   PUT /api/mission-vision/:id
// @access  Private
const updateMissionVisionItem = async (req, res) => {
  try {
    const { title, description } = req.body;

    const missionVisionItem = await MissionVision.findById(req.params.id);
    if (!missionVisionItem) {
      return res.status(404).json({ message: 'Mission/Vision item not found' });
    }

    missionVisionItem.title = title || missionVisionItem.title;
    missionVisionItem.description = description || missionVisionItem.description;

    const updatedItem = await missionVisionItem.save();
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete mission/vision item
// @route   DELETE /api/mission-vision/:id
// @access  Private
const deleteMissionVisionItem = async (req, res) => {
  try {
    const missionVisionItem = await MissionVision.findById(req.params.id);
    if (!missionVisionItem) {
      return res.status(404).json({ message: 'Mission/Vision item not found' });
    }

    await missionVisionItem.deleteOne();
    res.json({ message: 'Mission/Vision item removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createMissionVision,
  getMissionVisionItems,
  getMissionVisionItem,
  updateMissionVisionItem,
  deleteMissionVisionItem
};