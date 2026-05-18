const express = require('express');
const router = express.Router();
const Video = require('../models/Video');

// GET / - Homepage
router.get('/', async (req, res) => {
  try {
    const videos = await Video.find().limit(6);
    res.render('index', { videos });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});


router.get('/videos', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 8;
    const skip = (page - 1) * limit;

    const query = {};

    // Regex Search for Title
    if (req.query.search) {
      query.title = { $regex: req.query.search, $options: 'i' };
    }

    // Category Filtering
    if (req.query.category && req.query.category !== 'All') {
      query.category = req.query.category;
    }

    // Min Price
    if (req.query.minPrice) {
      query.price = { ...query.price, $gte: Number(req.query.minPrice) };
    }

    // Max Price
    if (req.query.maxPrice) {
      query.price = { ...query.price, $lte: Number(req.query.maxPrice) };
    }

    const totalVideos = await Video.countDocuments(query);
    const totalPages = Math.ceil(totalVideos / limit);

    const videos = await Video.find(query).skip(skip).limit(limit);

    res.render('videos', {
      videos,
      currentPage: page,
      totalPages,
      search: req.query.search || '',
      category: req.query.category || 'All',
      minPrice: req.query.minPrice || '',
      maxPrice: req.query.maxPrice || ''
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
