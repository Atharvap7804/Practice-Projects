// routes/productRoutes.js
const express = require('express');
const router = express.Router();

// If you have a product controller, import it:
// const { getAllProducts, getProductById } = require('../controllers/productController');

// Define at least one route (even a placeholder) so router isn’t empty
router.get('/', (req, res) => {
  res.json({ message: 'List of products will come here' });
});

// If you implement controller methods later, swap out the handler:
// router.get('/', getAllProducts);
// router.get('/:id', getProductById);

module.exports = router;
