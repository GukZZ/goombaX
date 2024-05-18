const mongoose = require('mongoose');

const AchievementSchema = new mongoose.Schema({
  achievement: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  usersUnlocked: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
    },
    unlocked: {
      type: Boolean,
      default: false
    }
  }]
});

const Achievement = mongoose.model('Achievement', AchievementSchema);

module.exports = Achievement;
