const express = require('express');
const multer = require('multer');
const router = express.Router();
const {
  createIndustry,
  getIndustries,
  getIndustry,
  updateIndustry,
  deleteIndustry
} = require('../controllers/industryController');

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
router.get('/', getIndustries);
router.get('/:id', getIndustry);
router.post('/', protect, upload.single('industry_image'), createIndustry);
router.put('/:id', protect, upload.single('industry_image'), updateIndustry);
router.delete('/:id', protect, deleteIndustry);

module.exports = router;