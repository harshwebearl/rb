const express = require('express');
const multer = require('multer');
const router = express.Router();
const {
  createGalleryItem,
  getGalleryItems,
  getGalleryItem,
  updateGalleryItem,
  deleteGalleryItem
} = require('../controllers/galleryController');

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
router.get('/', getGalleryItems);
router.get('/:id', getGalleryItem);
router.post('/', protect, upload.single('gallery_photo'), createGalleryItem);
router.put('/:id', protect, upload.single('gallery_photo'), updateGalleryItem);
router.delete('/:id', protect, deleteGalleryItem);

module.exports = router;