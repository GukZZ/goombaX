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

    // Найдите достижение, которое вы хотите обновить (например, по его ID)
    const achievementIdToUpdate = '6648d225ca818a0d5d52f0ef'; // Замените 'your_achievement_id' на фактический ID достижения
    const achievementToUpdate = await Achievement.findById(achievementIdToUpdate);

    // Проверка, найдено ли достижение
    if (!achievementToUpdate) {
      throw new Error('Achievement not found');
    }

    // Добавление пользователя в массив разблокировавших достижение
    const userIdToAdd = '66416bbe61702f2ec33b40da'; // Замените 'your_user_id' на фактический ID пользователя
    achievementToUpdate.usersUnlocked.push({ user: userIdToAdd, unlocked: true });

    // Сохранение обновленного достижения в базе данных
    await achievementToUpdate.save();

    console.log("Player added to unlocked list for achievement:", achievementToUpdate.description);
  } catch (error) {
    console.error(error);
  } finally {
    // Важно закрыть соединение с базой данных, когда задача завершена
    mongoose.connection.close();
  }
});
