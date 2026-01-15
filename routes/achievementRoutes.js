const express = require('express');
const router = express.Router();
const {
  createAchievement,
  getAchievements,
  getAchievement,
  updateAchievement,
  deleteAchievement
} = require('../controllers/achievementController');

// Middleware for authentication (placeholder)
const protect = (req, res, next) => {
  // TODO: Implement JWT authentication middleware
  next();
};

// Routes
router.get('/', getAchievements);
router.get('/:id', getAchievement);
router.post('/', protect, createAchievement);
router.put('/:id', protect, updateAchievement);
router.delete('/:id', protect, deleteAchievement);

module.exports = router;