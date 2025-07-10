const mongoose = require('mongoose');

const moodSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  mood: String,
  note: String,
  date: { type: Date, default: Date.now },
});


module.exports = mongoose.model('Mood', moodSchema);
