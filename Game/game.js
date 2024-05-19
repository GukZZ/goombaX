const config = {
  type: Phaser.AUTO,
  parent: 'game',
  width: 3600,
  height: 640,
  physics: {
      default: 'arcade',
      arcade: {
          gravity: { y: 500 }
      }
  },
  scene: [PreloadScene, GameScene, NextLevel],

  scale: {
    mode: Phaser.Scale.FIT, // Adjust based on what's best for your game
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 2700,
    height: 640
  }
};



const game = new Phaser.Game(config);

