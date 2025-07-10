const express = require('express');
const jwt = require('jsonwebtoken');
const Mood = require('../models/Mood');

const router = express.Router();

const auth = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified.id;
    next();
  } catch {
    res.status(400).json({ error: 'Invalid token' });
  }
};

router.post('/', auth, async (req, res) => {
  const { mood, note } = req.body;
  const entry = new Mood({ userId: req.user, mood, note });
  await entry.save();
  res.json(entry);
});

router.get('/', auth, async (req, res) => {
  const moods = await Mood.find({ userId: req.user }).sort({ date: -1 });
  res.json(moods);
});

module.exports = router;
