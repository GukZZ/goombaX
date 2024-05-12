class PreloadScene extends Phaser.Scene {
    constructor() {
      super('PreloadScene');
    }
    
    preload() {
      this.load.image('background', 'assets/images/background.png');
      this.load.image('tiles', 'assets/tilesets/platformPack_tilesheet.png');
      this.load.image('spike', 'assets/images/spike.png');
      this.load.image('voda', 'assets/images/voda.png');
      this.load.image('endLevel', 'assets/images/voda.png');
      this.load.tilemapTiledJSON('map', 'assets/tilemaps/level1.json');
      this.load.atlas('player', 'assets/images/kenney_player.png', 'assets/images/kenney_player_atlas.json');
    }
    
    create() {
      this.scene.start('GameScene');
    }
  }