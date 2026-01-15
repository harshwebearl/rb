const express = require('express');
const multer = require('multer');
const router = express.Router();
const {
  createJob,
  getJobs,
  getJob,
  getJobBySlug,
  updateJob,
  deleteJob
} = require('../controllers/jobController');

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
router.get('/', getJobs);
router.get('/slug/:slug', getJobBySlug);
router.get('/:id', getJob);
router.post('/', protect, upload.single('job_image'), createJob);
router.put('/:id', protect, upload.single('job_image'), updateJob);
router.delete('/:id', protect, deleteJob);

module.exports = router;