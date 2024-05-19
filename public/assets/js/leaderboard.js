document.addEventListener('DOMContentLoaded', function() {
  fetch('/times') // Assuming '/times' returns the sorted leaderboard times
      .then(response => response.json())
      .then(data => {
          const leaderboardTable = document.getElementById('leaderboard-table').getElementsByTagName('tbody')[0];
          data.forEach((entry, index) => {
              let row = leaderboardTable.insertRow();
              let cellRank = row.insertCell(0);
              let cellTime = row.insertCell(1);
              let cellName = row.insertCell(2);

              cellRank.innerHTML = index + 1;
              cellTime.innerHTML = entry.bestTime;
              cellName.innerHTML = entry.name;
          });
      })
      .catch(error => console.error('Error fetching leaderboard:', error));
});