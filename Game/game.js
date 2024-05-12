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
  scene: [PreloadScene, GameScene, NextLevel]
};

const game = new Phaser.Game(config);