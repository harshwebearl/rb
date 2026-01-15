const WorkingProcess = require('../models/WorkingProcess');

// @desc    Create a new working process step
// @route   POST /api/working-process
// @access  Private
const createWorkingProcess = async (req, res) => {
  try {
    const { step_number, title, description } = req.body;

    if (!step_number || !title || !description) {
      return res.status(400).json({ message: 'Step number, title, and description are required' });
    }

    // Check if step number already exists
    const existingStep = await WorkingProcess.findOne({ step_number });
    if (existingStep) {
      return res.status(400).json({ message: 'Step number already exists' });
    }

    const workingProcess = await WorkingProcess.create({
      step_number,
      title,
      description
    });

    res.status(201).json(workingProcess);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Step number already exists' });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

// @desc    Get all working process steps
// @route   GET /api/working-process
// @access  Public
const getWorkingProcesses = async (req, res) => {
  try {
    const workingProcesses = await WorkingProcess.find({}).sort({ step_number: 1 });
    res.json(workingProcesses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single working process step
// @route   GET /api/working-process/:id
// @access  Public
const getWorkingProcess = async (req, res) => {
  try {
    const workingProcess = await WorkingProcess.findById(req.params.id);
    if (workingProcess) {
      res.json(workingProcess);
    } else {
      res.status(404).json({ message: 'Working process step not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update working process step
// @route   PUT /api/working-process/:id
// @access  Private
const updateWorkingProcess = async (req, res) => {
  try {
    const { step_number, title, description } = req.body;

    const workingProcess = await WorkingProcess.findById(req.params.id);
    if (!workingProcess) {
      return res.status(404).json({ message: 'Working process step not found' });
    }

    // Check if new step number conflicts with existing (excluding current)
    if (step_number && step_number !== workingProcess.step_number) {
      const existingStep = await WorkingProcess.findOne({ 
        step_number, 
        _id: { $ne: req.params.id } 
      });
      if (existingStep) {
        return res.status(400).json({ message: 'Step number already exists' });
      }
    }

    workingProcess.step_number = step_number || workingProcess.step_number;
    workingProcess.title = title || workingProcess.title;
    workingProcess.description = description || workingProcess.description;

    const updatedProcess = await workingProcess.save();
    res.json(updatedProcess);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Step number already exists' });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

// @desc    Delete working process step
// @route   DELETE /api/working-process/:id
// @access  Private
const deleteWorkingProcess = async (req, res) => {
  try {
    const workingProcess = await WorkingProcess.findById(req.params.id);
    if (!workingProcess) {
      return res.status(404).json({ message: 'Working process step not found' });
    }

    await workingProcess.deleteOne();
    res.json({ message: 'Working process step removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createWorkingProcess,
  getWorkingProcesses,
  getWorkingProcess,
  updateWorkingProcess,
  deleteWorkingProcess
};