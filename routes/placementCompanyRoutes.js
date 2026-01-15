const express = require('express');
const multer = require('multer');
const router = express.Router();
const {
  createPlacementCompany,
  getPlacementCompanies,
  getPlacementCompany,
  updatePlacementCompany,
  deletePlacementCompany
} = require('../controllers/placementCompanyController');

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
router.get('/', getPlacementCompanies);
router.get('/:id', getPlacementCompany);
router.post('/', protect, upload.single('industry_photo'), createPlacementCompany);
router.put('/:id', protect, upload.single('industry_photo'), updatePlacementCompany);
router.delete('/:id', protect, deletePlacementCompany);

module.exports = router;