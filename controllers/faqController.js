const FAQ = require('../models/FAQ');

// @desc    Create a new FAQ
// @route   POST /api/faqs
// @access  Private
const createFAQ = async (req, res) => {
  try {
    const { question, answer } = req.body;

    if (!question || !answer) {
      return res.status(400).json({ message: 'Question and answer are required' });
    }

    const faq = await FAQ.create({
      question,
      answer
    });

    res.status(201).json(faq);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all FAQs
// @route   GET /api/faqs
// @access  Public
const getFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.find({});
    res.json(faqs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single FAQ
// @route   GET /api/faqs/:id
// @access  Public
const getFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findById(req.params.id);
    if (faq) {
      res.json(faq);
    } else {
      res.status(404).json({ message: 'FAQ not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update FAQ
// @route   PUT /api/faqs/:id
// @access  Private
const updateFAQ = async (req, res) => {
  try {
    const { question, answer } = req.body;

    const faq = await FAQ.findById(req.params.id);
    if (!faq) {
      return res.status(404).json({ message: 'FAQ not found' });
    }

    faq.question = question || faq.question;
    faq.answer = answer || faq.answer;

    const updatedFAQ = await faq.save();
    res.json(updatedFAQ);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete FAQ
// @route   DELETE /api/faqs/:id
// @access  Private
const deleteFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findById(req.params.id);
    if (!faq) {
      return res.status(404).json({ message: 'FAQ not found' });
    }

    await faq.deleteOne();
    res.json({ message: 'FAQ removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createFAQ,
  getFAQs,
  getFAQ,
  updateFAQ,
  deleteFAQ
};