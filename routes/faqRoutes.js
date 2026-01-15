const express = require('express');
const router = express.Router();
const {
  createFAQ,
  getFAQs,
  getFAQ,
  updateFAQ,
  deleteFAQ
} = require('../controllers/faqController');

// Middleware for authentication (placeholder)
const protect = (req, res, next) => {
  // TODO: Implement JWT authentication middleware
  next();
};

// Routes
router.get('/', getFAQs);
router.get('/:id', getFAQ);
router.post('/', protect, createFAQ);
router.put('/:id', protect, updateFAQ);
router.delete('/:id', protect, deleteFAQ);

module.exports = router;