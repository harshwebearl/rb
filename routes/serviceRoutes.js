const express = require('express');
const multer = require('multer');
const router = express.Router();
const {
  createService,
  getServices,
  getService,
  updateService,
  deleteService
} = require('../controllers/serviceController');

// Multer configuration for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Middleware for authentication (placeholder)
const protect = (req, res, next) => {
  // TODO: Implement JWT authentication middleware
  next();
};

// Routes
router.get('/', getServices);
router.get('/:id', getService);
router.post('/', protect, upload.fields([{ name: 'image' }, { name: 'file' }, { name: 'service_image' }]), createService);
router.put('/:id', protect, upload.fields([{ name: 'image' }, { name: 'file' }, { name: 'service_image' }]), updateService);
router.delete('/:id', protect, deleteService);

module.exports = router;