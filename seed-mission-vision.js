require('dotenv').config();
const mongoose = require('mongoose');
const MissionVision = require('./models/MissionVision');

// Get MongoDB URI from environment
const mongoUri = process.env.DATABASE_URL;

const missionVisionData = [
  {
    title: 'Empowering Careers & Businesses',
    description: 'Our mission is to connect talented professionals with forward-thinking organizations through ethical recruitment practices and personalized hiring strategies.'
  },
  {
    title: 'Shaping the Future of Talent',
    description: 'To become a trusted global recruitment partner known for innovation, integrity, and long-term value creation for businesses and professionals.'
  }
];

async function main() {
  try {
    console.log(`Connecting to MongoDB at ${mongoUri}...`);
    await mongoose.connect(mongoUri);
    console.log('✓ MongoDB connected\n');

    // Insert mission and vision data
    console.log('Creating mission and vision data...');
    const results = await MissionVision.insertMany(missionVisionData);
    
    console.log(`\n✓ Successfully created ${results.length} items:\n`);
    results.forEach((item) => {
      console.log(`  • ${item.title}`);
      console.log(`    ID: ${item._id}`);
      console.log(`    Description: ${item.description}\n`);
    });

    console.log('✓ All data created successfully via /api/mission-vision');
    
    // Show all mission/vision items
    const allItems = await MissionVision.find();
    console.log(`\nTotal mission/vision items in database: ${allItems.length}`);

    process.exit(0);
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

main();
