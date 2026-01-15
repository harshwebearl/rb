const WhyChoose = require('../models/WhyChoose');

// @desc    Create a new why choose item
// @route   POST /api/why-choose
// @access  Private
const createWhyChoose = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const whyChoose = await WhyChoose.create({
      title,
      description
    });

    res.status(201).json(whyChoose);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all why choose items
// @route   GET /api/why-choose
// @access  Public
const getWhyChooseItems = async (req, res) => {
  try {
    const whyChooseItems = await WhyChoose.find({});
    res.json(whyChooseItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single why choose item
// @route   GET /api/why-choose/:id
// @access  Public
const getWhyChooseItem = async (req, res) => {
  try {
    const whyChooseItem = await WhyChoose.findById(req.params.id);
    if (whyChooseItem) {
      res.json(whyChooseItem);
    } else {
      res.status(404).json({ message: 'Why choose item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update why choose item
// @route   PUT /api/why-choose/:id
// @access  Private
const updateWhyChooseItem = async (req, res) => {
  try {
    const { title, description } = req.body;

    const whyChooseItem = await WhyChoose.findById(req.params.id);
    if (!whyChooseItem) {
      return res.status(404).json({ message: 'Why choose item not found' });
    }

    whyChooseItem.title = title || whyChooseItem.title;
    whyChooseItem.description = description || whyChooseItem.description;

    const updatedItem = await whyChooseItem.save();
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete why choose item
// @route   DELETE /api/why-choose/:id
// @access  Private
const deleteWhyChooseItem = async (req, res) => {
  try {
    const whyChooseItem = await WhyChoose.findById(req.params.id);
    if (!whyChooseItem) {
      return res.status(404).json({ message: 'Why choose item not found' });
    }

    await whyChooseItem.deleteOne();
    res.json({ message: 'Why choose item removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createWhyChoose,
  getWhyChooseItems,
  getWhyChooseItem,
  updateWhyChooseItem,
  deleteWhyChooseItem
};