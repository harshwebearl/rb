const express = require('express');
const router = express.Router();
const {
  createStats,
  getAllStats,
  getStatsById,
  updateStats,
  deleteStats
} = require('../controllers/statsController');

// Placeholder for authentication middleware
const protect = (req, res, next) => {
  // TODO: Implement JWT authentication
  next();
};

// Routes
router.get('/', getAllStats); // Public route for viewing stats
router.get('/:id', protect, getStatsById); // Protected route for admin
router.post('/', protect, createStats); // Protected route for admin
router.put('/:id', protect, updateStats); // Protected route for admin
router.delete('/:id', protect, deleteStats); // Protected route for admin

module.exports = router;