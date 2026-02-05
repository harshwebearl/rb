require('dotenv').config();   // 🔥 FIRST LINE (IMPORTANT)

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const adminRoutes = require('./routes/adminRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const testimonialRoutes = require('./routes/testimonialRoutes');
const industryRoutes = require('./routes/industryRoutes');
const placementCompanyRoutes = require('./routes/placementCompanyRoutes');
const whyChooseRoutes = require('./routes/whyChooseRoutes');
const achievementRoutes = require('./routes/achievementRoutes');
const workingProcessRoutes = require('./routes/workingProcessRoutes');
const missionVisionRoutes = require('./routes/missionVisionRoutes');
const teamMemberRoutes = require('./routes/teamMemberRoutes');
const contactPageRoutes = require('./routes/contactPageRoutes');
const faqRoutes = require('./routes/faqRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const jobRoutes = require('./routes/jobRoutes');
const aboutSectionRoutes = require('./routes/aboutSectionRoutes');
const heroSectionRoutes = require('./routes/heroSectionRoutes');
const inquiryRoutes = require('./routes/inquiryRoutes');
const statsRoutes = require('./routes/statsRoutes');
const planRoutes = require('./routes/planRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB error:', err));

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/industries', industryRoutes);
app.use('/api/placement-companies', placementCompanyRoutes);
app.use('/api/why-choose', whyChooseRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/working-process', workingProcessRoutes);
app.use('/api/mission-vision', missionVisionRoutes);
app.use('/api/team-members', teamMemberRoutes);
app.use('/api/contact-page', contactPageRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/about-sections', aboutSectionRoutes);
app.use('/api/hero-sections', heroSectionRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/plans', planRoutes);
// Compatibility: also expose routes without `/api` prefix (e.g. /plans/book)
app.use('/plans', planRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('RB Hires Consulting LLC API');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
