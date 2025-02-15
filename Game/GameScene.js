class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }
  
  create() {
    const map = this.make.tilemap({ key: 'map' });
    const tileset = map.addTilesetImage('kenney_simple_platformer', 'tiles');
    const backstena = this.add.image(0, 0, 'backstena').setOrigin(0.6, 0);
    backstena.setScale(0.7, 1.2);
    const backgroundImage = this.add.image(860, 0, 'background').setOrigin(0.2, 0.4);
    backgroundImage.setScale(7, 1.5);
    const platforms = map.createStaticLayer('Platforms', tileset, 0, 200);
    const Water = map.createStaticLayer('Water', tileset, 0, 200);
    platforms.setCollisionByExclusion(-1, true);
    
this.player = this.physics.add.sprite(1250, 250, 'player');
this.player.setBounce(0.1);
this.player.setCollideWorldBounds(true);
// Adjust the size of the player's physics body
this.player.body.setSize(40, 90, true);
    this.physics.add.collider(this.player, platforms);

    const lerpFactor = 0.1; // Adjust the value to control the smoothness (0.1 for slower, 1 for instant follow)
    const cameraX = this.cameras.main.scrollX;
    const cameraY = this.cameras.main.scrollY;
    const targetX = this.player.x - this.cameras.main.width * 0.5;
    const targetY = this.player.y - this.cameras.main.height * 0.5;
    const lerpedX = Phaser.Math.Linear(cameraX, targetX, lerpFactor);
    const lerpedY = Phaser.Math.Linear(cameraY, targetY, lerpFactor);
    this.cameras.main.scrollX = lerpedX;
    this.cameras.main.scrollY = 0;
    

  
  
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
      spikeSprite.body.setSize(spike.width, spike.height - 20).setOffset(0, 30);
    });
    
    this.physics.add.collider(this.player, this.spikes, this.playerHit.bind(this), null, this);

    map.getObjectLayer('voda').objects.forEach((voda) => {
      const vodaSprite = this.voda.create(voda.x, voda.y + 200 - voda.height, 'voda').setOrigin(0);
      vodaSprite.body.setSize(voda.width, voda.height - 20).setOffset(0, 1);
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
        const lerpFactor = 0.1; // Adjust the value to control the smoothness (0.1 for slower, 1 for instant follow)
        const cameraX = this.cameras.main.scrollX;
        const cameraY = this.cameras.main.scrollY;
        const targetX = this.player.x - this.cameras.main.width * 0.5;
        const targetY = this.player.y - this.cameras.main.height * 0.6;
        const lerpedX = Phaser.Math.Linear(cameraX, targetX, lerpFactor);
        const lerpedY = Phaser.Math.Linear(cameraY, targetY, lerpFactor);
        this.cameras.main.scrollX = lerpedX;
        this.cameras.main.scrollY = 0;

        this.timerText.setPosition(this.player.x -  100, 0);
        
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
        player.setX(1250);
        player.setY(250);
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
      fetch('/get-user-email')
      .then(response => response.json())
      .then(data => {
        if(data.email) {
          this.submitTime(data.email);
        } else {
          console.error('No email found in session.');
          this.scene.pause();
        }
      })
      .catch((error) => {
        console.error('Failed to fetch user email:', error);
      });

      fetch('/unlock-achievement', {
        method: 'POST',
        credentials: 'include', // Necessary for including session cookies
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          // Assuming the server expects an achievement ID; replace 'your_achievement_id_here' with the actual ID
          achievementId: '664a1003502004064c025f80'
        })
      })
    }
    
    submitTime(userEmail) {
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
          if(data.error) {
              console.error('Error:', data.error);
          } else {
            window.location.href = '../game-menu.html'
          }
      })
      .catch((error) => {
          console.error('Network or server error:', error);
      });
    }

    checkAndNotifyAchievement(achievementId) {
      fetch('/unlock-achievement', {
          method: 'POST',
          credentials: 'include', // Necessary for including session cookies
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ achievementId: achievementId })
      })
      .then(response => response.json())
      .then(data => {
          if (data.message === 'Achievement unlocked') {
              this.showAchievementNotification('Achievement Unlocked!');
          } else if (data.message === 'Player has already unlocked this achievement') {
              // Player already has this achievement, do not show notification
              console.log('Achievement already unlocked.');
          }
      })
      .catch(error => console.error('Error unlocking achievement:', error));
  }
  
}