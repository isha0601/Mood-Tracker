const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const moodRoutes = require('./routes/moodRoutes');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

app.use('/api/auth', authRoutes);
app.use('/api/moods', moodRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB ✅');
    app.listen(3000, () => console.log('Server running: http://localhost:3000'));
  })
  .catch(err => console.log(err));
