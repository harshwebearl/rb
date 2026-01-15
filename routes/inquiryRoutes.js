const express = require('express');
const router = express.Router();
const {
  createInquiry,
  getAllInquiries,
  getInquiryById,
  updateInquiry,
  deleteInquiry
} = require('../controllers/inquiryController');

// Placeholder for authentication middleware
const protect = (req, res, next) => {
  // TODO: Implement JWT authentication
  next();
};

// Routes
router.post('/', createInquiry); // Public route for creating inquiries
router.get('/', protect, getAllInquiries); // Protected route for admin
router.get('/:id', protect, getInquiryById); // Protected route for admin
router.put('/:id', protect, updateInquiry); // Protected route for admin
router.delete('/:id', protect, deleteInquiry); // Protected route for admin

module.exports = router;