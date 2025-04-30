const express = require('express');
const router = express.Router();
const Order = require('../models/order'); 
const mongoose = require('mongoose'); // To validate ObjectId

router.post("/place-order", async (req, res) => {
  try {
    const { userId, cartItems, totalAmount, shippingDetails, paymentMethod } = req.body;

    console.log("Incoming Order Data:", req.body);

    if (!cartItems || !shippingDetails || !paymentMethod || !totalAmount) {
      return res.status(400).json({ error: "Missing required order fields" });
    }

    // Handle the case when it's a guest user
    const orderData = {
      shippingDetails,
      cartItems,
      totalAmount,
      paymentMethod,
    };

    // Only assign userId if it's a valid ObjectId (logged-in user)
    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      orderData.userId = userId;
    } else {
      orderData.isGuest = true; // Set isGuest flag for guest users
    }

    const newOrder = new Order(orderData);

    await newOrder.save();
    res.status(200).json({ message: "Order placed successfully" });
  } catch (err) {
    console.error("Error placing order:", err); // Log full error stack
    res.status(500).json({ error: "Failed to place order", details: err.message });
  }
});

module.exports = router;
