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

const bulletConfigs = {
  right: {
    offsetX: 20,
    offsetY: 10,
    velocityX: 800,
    velocityY: 0,
    flipX: false,
    rotation: 0,
  },
  left: {
    offsetX: -20,
    offsetY: 10,
    velocityX: -800,
    velocityY: 0,
    flipX: true,
    rotation: 0,
  },
  lookUpRight: {
    offsetX: 30,
    offsetY: -20,
    velocityX: 800,
    velocityY: -800,
    flipX: false,
    rotation: -45,
  },
  lookUpLeft: {
    offsetX: -30,
    offsetY: -20,
    velocityX: -800,
    velocityY: -800,
    flipX: true,
    rotation: 45,
  },
  lookUp: {
    offsetX: 15,
    offsetY: -30,
    velocityX: 0,
    velocityY: -800,
    flipX: false,
    rotation: -90,
  },
};

const dudeConfigs = {
  left: {
    setVelocityX: -160,
    action: "left",
    weaponPositionX: -12,
    weaponPositionY: 10,
    facing: "left",
    rotation: 0,
    flipX: true,
    visible: true,
  },
  right: {
    setVelocityX: 160,
    action: "right",
    weaponPositionX: 12,
    weaponPositionY: 10,
    facing: "right",
    rotation: 0,
    flipX: false,
    visible: true,
  },
  lookUpLeft: {
    setVelocityX: -160,
    action: "lookUpLeft",
    weaponPositionX: -30,
    weaponPositionY: -20,
    facing: "lookUpLeft",
    rotation: 45,
    flipX: true,
    visible: true,
  },
  lookUpRight: {
    setVelocityX: 160,
    action: "lookUpRight",
    weaponPositionX: 30,
    weaponPositionY: -20,
    facing: "lookUpRight",
    rotation: -45,
    flipX: false,
    visible: true,
  },
  lookUp: {
    setVelocityX: 0,
    action: "lookUp",
    weaponPositionX: 15,
    weaponPositionY: -30,
    facing: "lookUp",
    rotation: -90,
    flipX: false,
    visible: true,
  },
  turn: {
    setVelocityX: 0,
    action: "turn",
    weaponPositionX: 0,
    weaponPositionY: 0,
    facing: "turn",
    rotation: 0,
    flipX: false,
    visible: false,
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
  this.load.image("gun", "assets/Gun.png");

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

  //player
  player = this.physics.add.sprite(100, 450, "dude", 0);
  player.setScale(0.2);
  player.setCollideWorldBounds(true);
  player.setBounce(0.3);

  //gun
  this.weapon = this.add.sprite(player.x + 20, player.y - 20, "gun");
  this.weapon.setVisible(false);

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
    key: "lookUpLeft",
    frames: this.anims.generateFrameNumbers("dudeUp", { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1,
  });

  this.anims.create({
    key: "lookUp",
    frames: [{ key: "dudeUp", frame: 4 }],
    frameRate: 20,
    repeat: -1,
  });

  this.anims.create({
    key: "lookUpRight",
    frames: this.anims.generateFrameNumbers("dudeUp", { start: 5, end: 8 }),
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
  this.weapon.setPosition(player.x, player.y);

  if (vidas <= 0) {
    this.add
      .text(400, 270, "Fin de la partida", {
        fontSize: "64px",
        fill: "#ff0000",
      })
      .setOrigin(0.5);
    player.setVelocityX(0);
    return;
  }

  // Animaciones y movimiento
  if (this.keyW.isDown && cursors.right.isDown) {
    executeActions(this, "lookUpRight");
  } else if (this.keyW.isDown && cursors.left.isDown) {
    executeActions(this, "lookUpLeft");
  } else if (cursors.left.isDown) {
    executeActions(this, "left");
  } else if (cursors.right.isDown) {
    executeActions(this, "right");
  } else if (this.keyW.isDown) {
    executeActions(this, "lookUp");
  } else {
    executeActions(this, "turn");
  }

  if (this.keyE.isDown && player.facing !== "turn") {
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

//dude actions
function executeActions(scene, action) {
  const configDude = dudeConfigs[action];
  if (!configDude) return; // No se ejecuta si no hay configuración para la acción

  player.anims.play(configDude.action, true);
  player.setVelocityX(configDude.setVelocityX);
  player.facing = configDude.facing;
  scene.weapon.setVisible(configDude.visible);

  scene.weapon.setPosition(
    player.x + configDude.weaponPositionX,
    player.y + configDude.weaponPositionY
  );
  scene.weapon.setFlipX(configDude.flipX);
  scene.weapon.rotation = Phaser.Math.DegToRad(configDude.rotation);
}

//bullets
function shootBullet() {
  const config = bulletConfigs[player.facing];
  if (!config) return; // No se dispara si no hay configuración para la dirección

  const bulletX = player.x + config.offsetX;
  const bulletY = player.y + config.offsetY;

  const bullet = bullets.create(bulletX, bulletY, "bullet");
  bullet.body.setAllowGravity(false);
  bullet.setScale(0.05, 0.1);
  bullet.setVelocity(config.velocityX, config.velocityY);
  bullet.setFlipX(config.flipX);
  bullet.rotation = Phaser.Math.DegToRad(config.rotation);
}
