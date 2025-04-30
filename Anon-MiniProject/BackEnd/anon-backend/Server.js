const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

// Middlewares
app.use(cors());
app.use(express.json());

// Connect Database
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error(err));

// Routes
app.get('/', (req, res) => {
    res.send('API is running...');
  });
const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/cartRoutes');
const contactRoutes = require('./routes/contactRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/order')

app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/products', productRoutes);
app.use('/api/order', orderRoutes);  // 👈 ADD THIS

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
