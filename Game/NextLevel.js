class NextLevel extends Phaser.Scene {
    constructor() {
        super('NextLevelScene');
    }

    preload() {
        this.load.image('background', 'assets/images/background.png');
    }
    create() {
        const map = this.make.tilemap({ key: 'map' });
        const tileset = map.addTilesetImage('kenney_simple_platformer', 'tiles');
        const backgroundImage = this.add.image(0, 0, 'background').setOrigin(0, 0);
        backgroundImage.setScale(2, 0.8);
        const platforms = map.createStaticLayer('Platforms', tileset, 0, 200);
        const Water = map.createStaticLayer('Water', tileset, 0, 200);
        platforms.setCollisionByExclusion(-1, true);
        
        this.player = this.physics.add.sprite(50, 300, 'player');
        this.player.setBounce(0.1);
        this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.player, platforms);
        
        this.cameras.main.startFollow(this.player, true, 0.05, 0.05);
    }


}