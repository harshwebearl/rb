const express = require('express');
const router = express.Router();
const {
  createMissionVision,
  getMissionVisionItems,
  getMissionVisionItem,
  updateMissionVisionItem,
  deleteMissionVisionItem
} = require('../controllers/missionVisionController');

// Middleware for authentication (placeholder)
const protect = (req, res, next) => {
  // TODO: Implement JWT authentication middleware
  next();
};

// Routes
router.get('/', getMissionVisionItems);
router.get('/:id', getMissionVisionItem);
router.post('/', protect, createMissionVision);
router.put('/:id', protect, updateMissionVisionItem);
router.delete('/:id', protect, deleteMissionVisionItem);

module.exports = router;