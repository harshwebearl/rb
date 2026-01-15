const express = require('express');
const router = express.Router();
const {
  createWorkingProcess,
  getWorkingProcesses,
  getWorkingProcess,
  updateWorkingProcess,
  deleteWorkingProcess
} = require('../controllers/workingProcessController');

// Middleware for authentication (placeholder)
const protect = (req, res, next) => {
  // TODO: Implement JWT authentication middleware
  next();
};

// Routes
router.get('/', getWorkingProcesses);
router.get('/:id', getWorkingProcess);
router.post('/', protect, createWorkingProcess);
router.put('/:id', protect, updateWorkingProcess);
router.delete('/:id', protect, deleteWorkingProcess);

module.exports = router;