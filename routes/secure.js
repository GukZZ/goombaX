const express = require('express');
const asyncMiddleware = require('../middleware/asyncMiddleware');
const UserModel = require('../models/userModel');
const Achievement = require('../models/AchievementModel');
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

router.get('/get-user-email', function(req, res) {
  if (req.session && req.session.userEmail) {
    res.json({ email: req.session.userEmail });
  } else {
    res.status(404).send('Email not found in session');
  }
});

router.post('/unlock-achievement', async (req, res) => {
  try {
    const playerId = req.session.playerId; // Extract player ID from session
    const achievementId = '6649119fb7f6d839709f1366'; // The specific achievement ID you're targeting

    const achievement = await Achievement.findById(achievementId);

    if (!achievement) {
      return res.status(404).send('Achievement not found');
    }

    const userUnlocked = achievement.usersUnlocked.find(u => u.user.toString() === playerId);

    if (!userUnlocked) {
      // Add the player ID to the 'usersUnlocked' array with unlocked status
      achievement.usersUnlocked.push({ user: playerId, unlocked: true });
      
      // Optionally, if you want to mark the entire achievement as unlocked once any user unlocks it
      achievement.unlocked = true;

      await achievement.save(); // Persist changes to the database
      res.send('Achievement unlocked');
    } else {
      res.status(400).send('Player has already unlocked this achievement');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

module.exports = router;