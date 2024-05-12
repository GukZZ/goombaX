const express = require('express');
const asyncMiddleware = require('../middleware/asyncMiddleware');
const UserModel = require('../models/userModel');

const router = express.Router();

router.post('/submit-time', asyncMiddleware(async (req, res, next) => {
  const { email, time } = req.body;
  await UserModel.updateOne({ email }, { bestTime: time });
  res.status(200).json({ status: 'ok' });
}));

router.get('/times', asyncMiddleware(async (req, res, next) => {
  const users = await UserModel.find({}, 'name bestTime -_id').sort({ times: 1 }).limit(10);
  res.status(200).json(users);
}));

module.exports = router;