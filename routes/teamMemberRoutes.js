const express = require('express');
const multer = require('multer');
const router = express.Router();
const {
  createTeamMember,
  getTeamMembers,
  getTeamMember,
  updateTeamMember,
  deleteTeamMember
} = require('../controllers/teamMemberController');

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
router.get('/', getTeamMembers);
router.get('/:id', getTeamMember);
router.post('/', protect, upload.single('person_image'), createTeamMember);
router.put('/:id', protect, upload.single('person_image'), updateTeamMember);
router.delete('/:id', protect, deleteTeamMember);

module.exports = router;