class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
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
  
  
    // Ensure the player is active and controllable
    this.cursors = this.input.keyboard.createCursorKeys();

    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNames('player', {
        prefix: 'robo_player_',
        start: 2,
        end: 3,
      }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'idle',
      frames: [{ key: 'player', frame: 'robo_player_0' }],
      frameRate: 10,
    });

    this.anims.create({
      key: 'jump',
      frames: [{ key: 'player', frame: 'robo_player_1' }],
      frameRate: 10,
    });



    this.spikes = this.physics.add.group({
      allowGravity: false,
      immovable: true
    });
    
    this.voda = this.physics.add.group({
      allowGravity: false,
      immovable: true
    });

    this.endLevel = this.physics.add.group({
      allowGravity: false,
      immovable: true
    });

    map.getObjectLayer('Spikes').objects.forEach((spike) => {
      const spikeSprite = this.spikes.create(spike.x, spike.y + 200 - spike.height, 'spike').setOrigin(0);
      spikeSprite.body.setSize(spike.width, spike.height - 20).setOffset(0, 20);
    });
    
    this.physics.add.collider(this.player, this.spikes, this.playerHit.bind(this), null, this);

    map.getObjectLayer('voda').objects.forEach((voda) => {
      const vodaSprite = this.voda.create(voda.x, voda.y + 200 - voda.height, 'voda').setOrigin(0);
      vodaSprite.body.setSize(voda.width, voda.height - 20).setOffset(0, 20);
    });

    this.physics.add.collider(this.player, this.voda, this.playerHit.bind(this), null, this);



    map.getObjectLayer('endLevel').objects.forEach((endLevel) => {
      const endLevelSprite = this.endLevel.create(endLevel.x, endLevel.y + 200 - endLevel.height, 'endLevel').setOrigin(0);
      endLevelSprite.body.setSize(endLevel.width, endLevel.height).setOffset(0, 20);

    });
    
    this.physics.add.collider(this.player, this.endLevel, this.onLevelComplete.bind(this), null, this);

    this.gameTimer = 0;
    this.timerText = this.add.text(16, 16, 'Time: 0', { fontSize: '32px', fill: '#000' });
    
    // Start the timer
    this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.gameTimer++;
        this.timerText.setText('Time: ' + this.gameTimer);
      },
      callbackScope: this,
      loop: true
    });

  }
  
    update() {
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-200);
            this.player.play('walk', true);
            this.player.flipX = true; // Переворачиваем игрока влево
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(200);
            this.player.play('walk', true);
            this.player.flipX = false; // Переворачиваем игрока вправо
        } else {
            this.player.setVelocityX(0);
            this.player.play('idle', true);
        }
    
        if ((this.cursors.space.isDown || this.cursors.up.isDown) && this.player.body.onFloor()) {
            this.player.setVelocityY(-350);
            this.player.play('jump', true);
        }
    }

    
    playerHit(player, spike) {
        // Обработка столкновения игрока с опасным объектом
        player.setVelocity(0, 0);
        player.setX(50);
        player.setY(300);
        player.play('idle', true);
        player.setAlpha(0);

        // Постепенное возвращение видимости игрока
        let tw = this.tweens.add({
            targets: player,
            alpha: 1,
            duration: 100,
            ease: 'Linear',
            repeat: 5,
            onComplete: () => {
                // Restart the timer
                this.gameTimer = 0;
            }
        });
    }
    onLevelComplete(player, endlevel) {
      // Retrieve user email from local storage
      const userEmail = localStorage.getItem('userEmail');
    
      if(!userEmail) {
        console.error('User email not found in local storage.');
        // Optionally, prompt the user to log in again or provide other UI/UX feedback
        this.scene.pause(); // Pause the current scene
        this.scene.launch('LoginScene'); // Assume you have a 'LoginScene' for user login
        return; // Exit the function if userEmail is not found
      }
    
      fetch('/submit-time', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail, time: this.gameTimer }),
      })
      .then(response => response.json())
      .then(data => {
          console.log('Success:', data);
          // Handle success response
          if(data.error) {
              console.error('Error:', data.error);
              // Handle error (e.g., user not found or server error)
          } else {
              // Proceed with level completion or showing success message
              this.scene.start('NextLevelScene'); // Adjust according to your game's flow
          }
      })
      .catch((error) => {
          console.error('Network or server error:', error);
      });
    }
}