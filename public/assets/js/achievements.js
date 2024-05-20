document.addEventListener('DOMContentLoaded', function() {
    fetch('/current_user')
        .then(response => {
            if (!response.ok) throw new Error('Not logged in');
            return response.json();
        })
        .then(data => {
            const userId = data.userId;
            return fetch(`/achievements/${userId}`);
        })
        .then(response => response.json())
        .then(data => {
            const achievementsContainer = document.getElementById('achievements');
            data.forEach(achievement => {
                const achievementDiv = document.createElement('div');
                achievementDiv.className = achievement.isUnlocked ? 'achievement unlocked' : 'achievement';
                achievementDiv.innerHTML = `
                    <h3>${achievement.achievement}</h3>
                    <p>${achievement.description}</p>
                    <p>${achievement.isUnlocked ? 'Достижение получено!' : 'Достижение не получено:('}</p>
                `;
                achievementsContainer.appendChild(achievementDiv);
            });
        })
        .catch(error => console.error('Error:', error));
});
