const config = {
  type: Phaser.AUTO,
  parent: 'game',
  width: 10000,
  height: 640,
  physics: {
      default: 'arcade',
      arcade: {
          gravity: { y: 500 },
          debug: true

      }
  },

  
  scene: [PreloadScene, GameScene, NextLevel],



  scale: {
    mode: Phaser.Scale.FIT, // Adjust based on what's best for your game
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 5500,
    height: 640
  }
};



const game = new Phaser.Game(config);

