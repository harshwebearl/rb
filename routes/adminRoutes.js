const express = require('express');
const router = express.Router();
const {
  createAdmin,
  getAdmins,
  getAdmin,
  updateAdmin,
  deleteAdmin,
  loginAdmin
} = require('../controllers/adminController');

// Middleware for authentication (placeholder - implement JWT auth middleware)
const protect = (req, res, next) => {
  // TODO: Implement JWT authentication middleware
  next(); // Remove this and implement proper auth
};

// Public routes
router.post('/login', loginAdmin);
router.post('/', createAdmin); // Allow registration for now

// Protected routes
router.get('/', protect, getAdmins);
router.get('/:id', protect, getAdmin);
router.put('/:id', protect, updateAdmin);
router.delete('/:id', protect, deleteAdmin);

module.exports = router;