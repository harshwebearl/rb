const express = require('express');
const multer = require('multer');
const router = express.Router();
const {
  createHeroSection,
  getHeroSections,
  getHeroSection,
  updateHeroSection,
  deleteHeroSection
} = require('../controllers/heroSectionController');

// Multer configuration for file upload
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Middleware for authentication (placeholder)
const protect = (req, res, next) => {
  // TODO: Implement JWT authentication middleware
  next();
};

// Routes
router.get('/', getHeroSections);
router.get('/:id', getHeroSection);
router.post('/', protect, upload.single('hero_image'), createHeroSection);
router.put('/:id', protect, upload.single('hero_image'), updateHeroSection);
router.delete('/:id', protect, deleteHeroSection);

module.exports = router;