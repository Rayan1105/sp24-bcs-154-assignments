// Force Node.js to use Google's public DNS for Atlas SRV resolution
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const { MongoStore } = require('connect-mongo');
const flash = require('connect-flash');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/youtube-clone';
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Set EJS as view engine and public folder
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session and Flash middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'my_super_secret_key',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongoUrl: MONGO_URI }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));

app.use(flash());

// Global middleware for locals
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currentUser = req.session.user || null;
  next();
});

// Mount routers
app.use('/', require('./routes/auth'));
app.use('/', require('./routes/videos'));
app.use('/admin', require('./routes/admin'));
app.use('/api/v1', require('./routes/api'));
app.use('/sales', require('./routes/sales'));

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
