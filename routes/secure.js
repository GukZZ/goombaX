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
    if (!playerId) {
      return res.status(400).json({ message: 'Player ID missing from session' });
    }
    const achievementId = req.body.achievementId; // Use provided achievement ID or fallback to a specific one

    const achievement = await Achievement.findById(achievementId);

    if (!achievement) {
      return res.status(404).json({ message: 'Achievement not found' });
    }

    const userUnlocked = achievement.usersUnlocked.find(u => u.user.toString() === playerId);

    if (!userUnlocked) {
      achievement.usersUnlocked.push({ user: playerId, unlocked: true });
      achievement.unlocked = true;

      await achievement.save();
      res.json({ message: 'Achievement unlocked' });
    } else {
      res.status(400).json({ message: 'Player has already unlocked this achievement' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Server error' });
  }
});

router.get('/current_user', (req, res) => {
  // Assuming you store user info in req.user when authenticating
  if (req.user) {
    res.json({ userId: req.user._id });
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

router.get('/current_user', (req, res) => {
  // Assuming you store user info in req.user when authenticating
  if (req.user) {
    res.json({ userId: req.user._id });
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

router.get('/achievements/:userId', async (req, res) => {
  try {
    const userId = req.user._id;
    const achievements = await Achievement.find();
    const userAchievements = achievements.map(achievement => ({
      ...achievement.toJSON(),
      isUnlocked: Boolean(achievement.usersUnlocked.find(u => u.user.toString() === userId))
    }));
    res.json(userAchievements);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

module.exports = router;