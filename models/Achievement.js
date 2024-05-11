// AchievementModel.js

const mongoose = require('mongoose');


const achievements = [
  { id: 1, name: "Первый прыжок", description: "Совершите свой первый прыжок в игре", achieved: true },
  { id: 2, name: "Победитель", description: "Выиграйте уровень без потерь", achieved: false },
  // Добавьте другие достижения по необходимости
];
const Achievement = mongoose.model('Achievement', achievementSchema);

module.exports = Achievement;
