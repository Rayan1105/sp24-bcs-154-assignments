const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  items: [{
    video: { type: mongoose.Schema.Types.ObjectId, ref: 'Video', required: true },
    quantity: { type: Number, required: true, default: 1 }
  }],
  totalAmount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
