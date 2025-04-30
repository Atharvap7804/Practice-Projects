const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  isGuest: {
    type: Boolean,
    default: false
  },
  shippingDetails: {
    fullName: String,
    contactNumber: String,
    email: String,
    address: String,
    state: String,
  },
  cartItems: [
    {
      productId: String,
      name: String,
      brand: String,
      img: String,
      price: Number,
      quantity: Number,
    }
  ],
  totalAmount: Number,
  paymentMethod: String,
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Order', orderSchema);
