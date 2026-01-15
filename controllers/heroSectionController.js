const HeroSection = require('../models/HeroSection');
const cloudinary = require('cloudinary').v2;

/* ============================
   CLOUDINARY CONFIG
============================ */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/* ============================
   HELPER: BUFFER UPLOAD
============================ */
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'hero-sections' },
      (error, result) => {
        if (error) {
          console.error('❌ Cloudinary Upload Error:', error);
          reject(error);
        } else {
          console.log('✅ Cloudinary Upload Success:', result.secure_url);
          resolve(result);
        }
      }
    );
    stream.end(buffer);
  });
};

/* ============================
   CREATE HERO SECTION
============================ */
const createHeroSection = async (req, res) => {
  try {
    console.log('📥 BODY:', req.body);
    console.log('📥 FILE:', req.file);

    const {
      main_heading,
      highlight_text_1,
      highlight_text_2,
      description_line_1,
      description_line_2
    } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded' });
    }

    if (!main_heading || !highlight_text_1 || !description_line_1) {
      return res.status(400).json({
        message: 'Main heading, highlight text 1, and description line 1 are required'
      });
    }

    const uploadResult = await uploadToCloudinary(req.file.buffer);

    const heroSection = await HeroSection.create({
      main_heading,
      highlight_text_1,
      highlight_text_2: highlight_text_2 || '',
      description_line_1,
      description_line_2: description_line_2 || '',
      hero_image: uploadResult.secure_url,
      public_id: uploadResult.public_id
    });

    console.log('✅ HERO CREATED:', heroSection._id);
    res.status(201).json(heroSection);

  } catch (error) {
    console.error('🔥 CREATE ERROR:', error);
    res.status(500).json({ message: error.message });
  }
};

/* ============================
   GET ALL HERO SECTIONS
============================ */
const getHeroSections = async (req, res) => {
  try {
    const heroSections = await HeroSection.find().sort({ createdAt: -1 });
    res.json(heroSections);
  } catch (error) {
    console.error('🔥 GET ALL ERROR:', error);
    res.status(500).json({ message: error.message });
  }
};

/* ============================
   GET SINGLE HERO SECTION
============================ */
const getHeroSection = async (req, res) => {
  try {
    const heroSection = await HeroSection.findById(req.params.id);

    if (!heroSection) {
      return res.status(404).json({ message: 'Hero section not found' });
    }

    res.json(heroSection);
  } catch (error) {
    console.error('🔥 GET ONE ERROR:', error);
    res.status(500).json({ message: error.message });
  }
};

/* ============================
   UPDATE HERO SECTION
============================ */
const updateHeroSection = async (req, res) => {
  try {
    console.log('✏️ UPDATE ID:', req.params.id);
    console.log('✏️ BODY:', req.body);
    console.log('✏️ FILE:', req.file);

    const heroSection = await HeroSection.findById(req.params.id);
    if (!heroSection) {
      return res.status(404).json({ message: 'Hero section not found' });
    }

    let updateData = {
      ...req.body
    };

    if (req.file) {
      console.log('🗑️ Removing old image:', heroSection.public_id);
      await cloudinary.uploader.destroy(heroSection.public_id);

      const uploadResult = await uploadToCloudinary(req.file.buffer);
      updateData.hero_image = uploadResult.secure_url;
      updateData.public_id = uploadResult.public_id;
    }

    const updatedHero = await HeroSection.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    console.log('✅ HERO UPDATED:', updatedHero._id);
    res.json(updatedHero);

  } catch (error) {
    console.error('🔥 UPDATE ERROR:', error);
    res.status(500).json({ message: error.message });
  }
};

/* ============================
   DELETE HERO SECTION
============================ */
const deleteHeroSection = async (req, res) => {
  try {
    console.log('🗑️ DELETE ID:', req.params.id);

    const heroSection = await HeroSection.findById(req.params.id);
    if (!heroSection) {
      return res.status(404).json({ message: 'Hero section not found' });
    }

    await cloudinary.uploader.destroy(heroSection.public_id);
    await heroSection.deleteOne();

    console.log('✅ HERO DELETED');
    res.json({ message: 'Hero section removed' });

  } catch (error) {
    console.error('🔥 DELETE ERROR:', error);
    res.status(500).json({ message: error.message });
  }
};

/* ============================
   EXPORTS
============================ */
module.exports = {
  createHeroSection,
  getHeroSections,
  getHeroSection,
  updateHeroSection,
  deleteHeroSection
};
