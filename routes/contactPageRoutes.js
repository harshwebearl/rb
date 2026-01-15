const express = require('express');
const router = express.Router();
const {
  createContactPage,
  getContactPages,
  getContactPage,
  updateContactPage,
  deleteContactPage
} = require('../controllers/contactPageController');

// Middleware for authentication (placeholder)
const protect = (req, res, next) => {
  // TODO: Implement JWT authentication middleware
  next();
};

// Routes
router.get('/', getContactPages);
router.get('/:id', getContactPage);
router.post('/', protect, createContactPage);
router.put('/:id', protect, updateContactPage);
router.delete('/:id', protect, deleteContactPage);

module.exports = router;