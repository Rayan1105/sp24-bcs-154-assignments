const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Video = require('../models/Video');
const User = require('../models/User');
const { verifyToken } = require('../middleware/jwt');

// ==========================================
// PUBLIC ROUTES
// ==========================================

// GET /videos - Return array of videos
router.get('/videos', async (req, res) => {
  try {
    const videos = await Video.find();
    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching videos' });
  }
});

// GET /videos/:id - Return a specific video
router.get('/videos/:id', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ error: 'Video not found' });
    res.json(video);
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching video' });
  }
});

// ==========================================
// AUTHENTICATION ROUTE
// ==========================================

// POST /auth/login - Generate JWT
router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    // Create JWT Payload
    const payload = {
      id: user._id,
      email: user.email,
      role: user.role
    };
    
    // Sign token (expires in 1 hour)
    const token = jwt.sign(
      payload, 
      process.env.JWT_SECRET || 'fallback_jwt_secret', 
      { expiresIn: '1h' }
    );
    
    res.json({
      message: 'Login successful',
      token: token,
      user: payload
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error during login' });
  }
});

// ==========================================
// PROTECTED ROUTES
// ==========================================

// POST /orders - Create a dummy order
router.post('/orders', verifyToken, (req, res) => {
  // Normally you would save an order to the database here
  // using req.body.videoId, etc.
  
  res.json({
    message: 'Order successfully created',
    orderId: 'ORD-' + Math.floor(Math.random() * 1000000),
    user: req.user
  });
});

// GET /user/profile - Return logged-in user info
router.get('/user/profile', verifyToken, (req, res) => {
  res.json({
    message: 'User profile retrieved successfully',
    user: req.user
  });
});

module.exports = router;
