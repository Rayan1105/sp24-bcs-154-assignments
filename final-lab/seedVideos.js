require('dotenv').config();

// Force Node.js to use Google's public DNS for SRV resolution
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const mongoose = require('mongoose');
const Video = require('./models/Video');

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected for seeding'))
  .catch(err => console.error(err));

const seedDB = async () => {
  try {
    await Video.deleteMany({});
    console.log('Cleared existing videos.');

    const categories = ['Gaming', 'Education', 'Entertainment', 'Tech', 'Music'];
    const dummyVideos = [];

    for (let i = 1; i <= 25; i++) {
      dummyVideos.push({
        title: `Dummy Video ${i} - ${categories[i % 5]}`,
        price: Math.floor(Math.random() * 50) + 5,
        category: categories[i % 5],
        rating: (Math.random() * 2 + 3).toFixed(1),
        stock: Math.floor(Math.random() * 100),
        thumbnail: `/thumbnails/thumbnail-${(i % 6) + 1}.webp`,
        channelPicture: `/channel-pictures/channel-${((i - 1) % 6) + 1}.jpeg`
      });
    }

    await Video.insertMany(dummyVideos);
    console.log('Successfully seeded 25 videos.');
  } catch (error) {
    console.error('Error seeding DB:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedDB();

seedDB();
