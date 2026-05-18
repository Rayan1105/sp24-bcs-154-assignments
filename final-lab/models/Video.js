const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  rating: { type: Number, required: true },
  stock: { type: Number, required: true },
  thumbnail: { type: String, required: true },
  channelPicture: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Video', videoSchema);
