const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Common aggregation logic
const getSalesData = async () => {
  const result = await Order.aggregate([
    {
      $facet: {
        totals: [
          { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' }, totalOrders: { $sum: 1 } } }
        ],
        recent: [
          { $sort: { createdAt: -1 } },
          { $limit: 10 },
          {
            $lookup: {
              from: 'videos',
              localField: 'items.video',
              foreignField: '_id',
              as: 'videoDetails'
            }
          }
        ]
      }
    }
  ]);

  const totals = result[0].totals[0] || { totalRevenue: 0, totalOrders: 0 };
  const recentTransactions = result[0].recent;

  return {
    totalRevenue: totals.totalRevenue,
    totalOrders: totals.totalOrders,
    recentTransactions
  };
};

// GET /sales - Render dashboard
router.get('/', async (req, res) => {
  try {
    const data = await getSalesData();
    res.render('sales', data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// GET /api/sales-data - JSON endpoint for polling
router.get('/api/sales-data', async (req, res) => {
  try {
    const data = await getSalesData();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;
