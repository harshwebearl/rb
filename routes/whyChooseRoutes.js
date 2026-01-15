const express = require('express');
const router = express.Router();
const {
  createWhyChoose,
  getWhyChooseItems,
  getWhyChooseItem,
  updateWhyChooseItem,
  deleteWhyChooseItem
} = require('../controllers/whyChooseController');

// Middleware for authentication (placeholder)
const protect = (req, res, next) => {
  // TODO: Implement JWT authentication middleware
  next();
};

// Routes
router.get('/', getWhyChooseItems);
router.get('/:id', getWhyChooseItem);
router.post('/', protect, createWhyChoose);
router.put('/:id', protect, updateWhyChooseItem);
router.delete('/:id', protect, deleteWhyChooseItem);

module.exports = router;