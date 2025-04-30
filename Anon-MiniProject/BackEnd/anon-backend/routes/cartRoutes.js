const express = require('express');
const router  = express.Router();
const CartItem = require('../models/Cartitem');

router.post('/add', async (req, res) => {
  const { userId, productId } = req.body;
  if (!userId || !productId) {
    return res.status(400).json({ success: false, message: 'userId and productId are required' });
  }
  try {
    let existing = await CartItem.findOne({ userId, productId });
    if (existing) {
      existing.quantity += 1;
      await existing.save();
    } else {
      await new CartItem({ userId, productId }).save();
    }
    res.json({ success: true, message: 'Item added to cart' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

module.exports = router;
