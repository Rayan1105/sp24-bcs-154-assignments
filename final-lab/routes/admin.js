const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Video = require('../models/Video');
const fs = require('fs');

// Configure Multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, '../public/uploads');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'thumbnail-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// GET /admin - Dashboard
router.get('/', async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.render('admin/dashboard', { videos });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// GET /admin/add - Show Add Form
router.get('/add', (req, res) => {
  res.render('admin/add-video');
});

// POST /admin/add - Handle Add Form Submission
router.post('/add', upload.single('thumbnail'), async (req, res) => {
  try {
    const { title, price, category, rating, stock } = req.body;
    let thumbnailPath = '';
    
    if (req.file) {
      thumbnailPath = '/uploads/' + req.file.filename;
    }

    const newVideo = new Video({
      title,
      price: Number(price),
      category,
      rating: Number(rating),
      stock: Number(stock),
      thumbnail: thumbnailPath
    });

    await newVideo.save();
    res.redirect('/admin');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// GET /admin/edit/:id - Show Edit Form
router.get('/edit/:id', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).send('Video not found');
    res.render('admin/edit-video', { video });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// POST /admin/edit/:id - Handle Edit Form Submission
router.post('/edit/:id', upload.single('thumbnail'), async (req, res) => {
  try {
    const { title, price, category, rating, stock } = req.body;
    const updateData = {
      title,
      price: Number(price),
      category,
      rating: Number(rating),
      stock: Number(stock)
    };

    if (req.file) {
      updateData.thumbnail = '/uploads/' + req.file.filename;
    }

    await Video.findByIdAndUpdate(req.params.id, updateData);
    res.redirect('/admin');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// POST /admin/delete/:id - Handle Delete
router.post('/delete/:id', async (req, res) => {
  try {
    await Video.findByIdAndDelete(req.params.id);
    res.redirect('/admin');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
