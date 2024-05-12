let leaderboard, times;

class Time extends Phaser.Scene {

  constructor() {
    super({
      key: 'Time',
      active: true
    });
  }

  preload() {
    this.load.bitmapFont('arcade', 'assets/arcade.png', 'assets/arcade.xml');
  }

  create() {
    this.add.bitmapText(100, 110, 'arcade', 'RANK  TIME   NAME').setTint(0xffffff);

    for (let i = 1; i < 6; i++) {
      if (bestTime[i-1]) {
        // Assuming times are stored in a format or unit that can be directly displayed
        this.add.bitmapText(100, 160 + 50 * i, 'arcade', ` ${i}      ${bestTime[i-1].time}    ${bestTime[i-1].name}`).setTint(0xffffff);
      } else {
        this.add.bitmapText(100, 160 + 50 * i, 'arcade', ` ${i}      ---    ---`).setTint(0xffffff);
      }
    }
  }
}

let config = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: 800,
  height: 600,
  pixelArt: true,
  scene: [Time]
};

$.ajax({
  type: 'GET',
  url: '/times', // Ensure this is the correct endpoint
  success: function(data) {
    console.log("AJAX call successful. Data:", data);
    times = data.sort((a, b) => a.time - b.time);
    game = new Phaser.Game(config);
  },
  error: function(xhr) {
    console.error("AJAX call failed", xhr);
  }
});