require('dotenv').config();

// Force Node.js to use Google's public DNS for SRV resolution
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const mongoose = require('mongoose');
const Video = require('./models/Video');

const Order = require('./models/Order');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected for seeding'))
  .catch(err => console.error(err));

const seedDB = async () => {
  try {
    await Video.deleteMany({});
    await Order.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared existing videos, orders, and users.');

    // Seed Admin
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@test.com',
      password: 'password123',
      role: 'admin'
    });
    await adminUser.save();
    console.log('Successfully seeded admin account.');

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

    const insertedVideos = await Video.insertMany(dummyVideos);
    console.log('Successfully seeded 25 videos.');

    // Seed dummy orders
    const dummyOrders = [];
    for (let i = 0; i < 10; i++) {
      const randomVideo = insertedVideos[Math.floor(Math.random() * insertedVideos.length)];
      const quantity = Math.floor(Math.random() * 3) + 1;
      
      dummyOrders.push({
        items: [{ video: randomVideo._id, quantity }],
        totalAmount: randomVideo.price * quantity,
        createdAt: new Date(Date.now() - Math.random() * 1000000000) // Random date in the past
      });
    }
    
    await Order.insertMany(dummyOrders);
    console.log('Successfully seeded 10 orders.');

  } catch (error) {
    console.error('Error seeding DB:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedDB();
