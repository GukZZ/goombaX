const mongoose = require('mongoose');
const Achievement = require('./models/AchievementModel'); // Путь к вашей модели достижений

// Подключение к MongoDB
mongoose.connect('mongodb://localhost:27017/');

const db = mongoose.connection;

// Обработчик ошибок при подключении к базе данных
db.on('error', console.error.bind(console, 'connection error:'));

// Обработчик успешного подключения к базе данных
db.once('open', async function() {
  try {
    console.log("Connected successfully");

    // Создание нового достижения
    const newAchievement = new Achievement({
      achievement: "CZX!", // Исправлено на маленькую букву согласно схеме
      description: "ZXC",
      usersUnlocked: [] // Изначально ни один пользователь не разблокировал это достижение
    });

    // Сохранение нового достижения в базу данных
    const savedAchievement = await newAchievement.save();
    console.log("New achievement added:", savedAchievement.description);
  } catch (error) {
    console.error(error);
  } finally {
    // Важно закрыть соединение с базой данных, когда задача завершена
    mongoose.connection.close();
  }
});
