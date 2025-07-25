const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

var game = new Phaser.Game(config);

var player;
var platforms;
var cursors;
var score = 0;
var scoreText;
var vidas = 3;
var vidasText;
var puedePerderVida = true;

function preload() {
  this.load.image("sky", "assets/Luna pixelart.png");
  this.load.image("ground", "assets/ground.png");
  this.load.image("bullet", "assets/bala.png");

  //dude sprites
  this.load.spritesheet("dude", "assets/dude.png", {
    frameWidth: 320,
    frameHeight: 320,
  });
  this.load.spritesheet("dudeUp", "assets/dudeUp.png", {
    frameWidth: 320,
    frameHeight: 320,
  });
}

function create() {
  //claves personalizadas
  this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
  this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

  //tiempo de intervalos de balas
  this.lastShootTime = 0;
  this.shootCooldown = 300;

  this.add
    .image(0, 0, "sky")
    .setOrigin(0)
    .setDisplaySize(
      this.sys.game.config.width,
      this.sys.game.config.height - 30
    );

  platforms = this.physics.add.staticGroup();
  platforms.create(650, 230, "ground").setScale(1, 0.4).refreshBody();
  platforms.create(100, 400, "ground").setScale(1, 0.4).refreshBody();
  platforms.create(400, 568, "ground").setScale(2, 0.6).refreshBody();
  player = this.physics.add.sprite(100, 450, "dude", 0);
  player.setScale(0.2);

  player.setCollideWorldBounds(true);
  player.setBounce(0.3);

  //animaciones normales
  this.anims.create({
    key: "left",
    frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1,
  });

  this.anims.create({
    key: "turn",
    frames: [{ key: "dude", frame: 4 }],
    frameRate: 20,
  });

  this.anims.create({
    key: "right",
    frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1,
  });

  //----animaciones mirando arriba
  this.anims.create({
    key: "lookUp",
    frames: [{ key: "dudeUp", frame: 4 }],
    frameRate: 20,
  });

  this.anims.create({
    key: "lookUpRight",
    frames: this.anims.generateFrameNumbers("dudeUp", { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1,
  });

  this.anims.create({
    key: "lookUpLeft",
    frames: this.anims.generateFrameNumbers("dudeUp", { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1,
  });

  scoreText = this.add.text(16, 16, "Puntuación: 0", {
    fontSize: "32px",
    fill: "#fff",
  });

  // Crear el texto de las vidas
  vidasText = this.add.text(16, 50, "Vidas: " + vidas, {
    fontSize: "32px",
    fill: "#fff",
  });

  //colisiones
  this.physics.add.collider(player, platforms);

  cursors = this.input.keyboard.createCursorKeys();
  bullets = this.physics.add.group();
}

function update() {
  if (vidas <= 0) {
    // Si no quedan vidas, mostrar mensaje de fin de la partida
    this.add
      .text(400, 270, "Fin de la partida", {
        fontSize: "64px",
        fill: "#ff0000",
      })
      .setOrigin(0.5);
    player.setVelocityX(0);
    return;
  }

  //animaciones mirando arriba
  if (this.keyW.isDown && cursors.right.isDown) {
    player.anims.play("lookUpRight", true);
    player.setVelocityX(160);
    return;
  } else if (this.keyW.isDown && cursors.left.isDown) {
    player.anims.play("lookUpLeft", true);
    player.setVelocityX(-160);
    return;
  } else if (this.keyW.isDown) {
    player.anims.play("lookUp", true);
    player.setVelocityX(0);
    return;
  }

  //animaciones normales
  if (cursors.left.isDown) {
    player.setVelocityX(-160);
    player.anims.play("left", true);
    player.facing = "left";
  } else if (cursors.right.isDown) {
    player.setVelocityX(160);
    player.anims.play("right", true);
    player.facing = "right";
  } else {
    player.setVelocityX(0);
    player.anims.play("turn");
  }

  if (this.keyE.isDown) {
    const currentTime = this.time.now;

    //intervalo de tiempo entre disparo
    if (currentTime - this.lastShootTime > this.shootCooldown) {
      shootBullet();
      this.lastShootTime = currentTime;
    }
  }

  if (cursors.up.isDown && player.body.touching.down) {
    player.setVelocityY(-330);
  }
}

//-----secondary functions
function shootBullet() {
  let bulletSpeed = 800;
  let direction = player.facing === "right" ? 1 : -1;

  let bulletX = player.x + (direction + 20);
  let bulletY = player.y;

  let bullet = bullets.create(bulletX, bulletY, "bullet");
  bullet.body.setAllowGravity(false);
  bullet.setScale(0.08, 0.1);
  bullet.setVelocityX(bulletSpeed * direction);

  bullet.setFlipX(direction === -1);
}
