const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  brand: String,
  image: String,
  price: Number,
  description: String,
  stock: Number
});

module.exports = mongoose.model('Product', productSchema);
