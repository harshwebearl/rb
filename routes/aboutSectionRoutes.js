const express = require('express');
const multer = require('multer');
const router = express.Router();
const {
  createAboutSection,
  getAboutSections,
  getAboutSection,
  updateAboutSection,
  deleteAboutSection
} = require('../controllers/aboutSectionController');

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
router.get('/', getAboutSections);
router.get('/:id', getAboutSection);
router.post('/', protect, upload.single('about_image'), createAboutSection);
router.put('/:id', protect, upload.single('about_image'), updateAboutSection);
router.delete('/:id', protect, deleteAboutSection);

module.exports = router;