const express = require('express');
const asyncMiddleware = require('../middleware/asyncMiddleware');
const UserModel = require('../models/userModel');

const router = express.Router();

router.get('/times', asyncMiddleware(async (req, res, next) => {
  const users = await UserModel.find({}, 'name bestTime -_id').sort({ bestTime: 1 }).limit(10);
  res.status(200).json(users);
}));

router.post('/submit-time', asyncMiddleware(async (req, res, next) => {
  const { email, time } = req.body;
  const parsedTime = Number(time);
  if (!Number.isNaN(parsedTime) && parsedTime > 0) {
    const user = await UserModel.findOne({ email });
    if (user && (user.bestTime > parsedTime)) {
      await UserModel.updateOne({ email }, { $set: { bestTime: parsedTime } })
        .then(updateResult => {
          if(updateResult.nModified > 0) {
            res.status(200).json({ status: 'ok', msg: 'New best time saved.' });
          } else {
            res.status(200).json({ status: 'ok', msg: 'Time update attempted but not necessary.' });
          }
        })
        .catch(error => {
          console.error('Error updating time:', error);
          res.status(500).json({ error: 'Error updating user time' });
        });
    } else if (!user) {
      res.status(404).json({ error: 'User not found' });
    } else {
      res.status(200).json({ status: 'ok', msg: 'Current time is not better than the best time.' });
    }
  } else {
    res.status(400).json({ error: 'Invalid time value' });
  }
}));

module.exports = router;