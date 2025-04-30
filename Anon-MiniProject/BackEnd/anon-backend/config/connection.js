// server/db/connection.js
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/anon', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error: ', err));
