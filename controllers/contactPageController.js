const ContactPage = require('../models/ContactPage');

// @desc    Create a new contact page entry
// @route   POST /api/contact-page
// @access  Private
const createContactPage = async (req, res) => {
  try {
    const { phone_number, email, whatsapp_number, office_address, google_map_embed } = req.body;

    if (!phone_number || !email || !office_address) {
      return res.status(400).json({ message: 'Phone number, email, and office address are required' });
    }

    const contactPage = await ContactPage.create({
      phone_number,
      email,
      whatsapp_number: whatsapp_number || '',
      office_address,
      google_map_embed: google_map_embed || ''
    });

    res.status(201).json(contactPage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all contact page entries
// @route   GET /api/contact-page
// @access  Public
const getContactPages = async (req, res) => {
  try {
    const contactPages = await ContactPage.find({});
    res.json(contactPages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single contact page entry
// @route   GET /api/contact-page/:id
// @access  Public
const getContactPage = async (req, res) => {
  try {
    const contactPage = await ContactPage.findById(req.params.id);
    if (contactPage) {
      res.json(contactPage);
    } else {
      res.status(404).json({ message: 'Contact page entry not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update contact page entry
// @route   PUT /api/contact-page/:id
// @access  Private
const updateContactPage = async (req, res) => {
  try {
    const { phone_number, email, whatsapp_number, office_address, google_map_embed } = req.body;

    const contactPage = await ContactPage.findById(req.params.id);
    if (!contactPage) {
      return res.status(404).json({ message: 'Contact page entry not found' });
    }

    contactPage.phone_number = phone_number || contactPage.phone_number;
    contactPage.email = email || contactPage.email;
    contactPage.whatsapp_number = whatsapp_number !== undefined ? whatsapp_number : contactPage.whatsapp_number;
    contactPage.office_address = office_address || contactPage.office_address;
    contactPage.google_map_embed = google_map_embed !== undefined ? google_map_embed : contactPage.google_map_embed;

    const updatedContactPage = await contactPage.save();
    res.json(updatedContactPage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete contact page entry
// @route   DELETE /api/contact-page/:id
// @access  Private
const deleteContactPage = async (req, res) => {
  try {
    const contactPage = await ContactPage.findById(req.params.id);
    if (!contactPage) {
      return res.status(404).json({ message: 'Contact page entry not found' });
    }

    await contactPage.deleteOne();
    res.json({ message: 'Contact page entry removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createContactPage,
  getContactPages,
  getContactPage,
  updateContactPage,
  deleteContactPage
};