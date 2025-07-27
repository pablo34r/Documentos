//configs
import { portalPositions } from "./configs/portalEnemyConfig.js";

//auxiliary
import spritePhysics from "./auxiliary/spritePhysics.js";
import { executeActions } from "./actions/executeAction.js";
//enemies
import { spawnEnemies } from "./enemies/spawnEnemies.js";
import { EnemyFollowsPlayer } from "./enemies/EnemyFollowsPlayer.js";

//combat
import { hitEnemy } from "./combat/hitEnemy.js";
import { playerHitByEnemy } from "./combat/playerHitByEenemy.js";
import { destroyBullet } from "./combat/destroyBullet.js";
import { shootBullet } from "./combat/shootBullet.js";

//boosts
import { spawnBoost } from "./boost/spawnBoost.js";
import { collectBoost } from "./boost/collectBoost.js";

const config = {
  type: Phaser.AUTO,
  width: 1920,
  height: 1000,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: true,
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
var bullets;
var boosts;

function preload() {
  this.load.image("sky", "assets/Luna pixelart.png");
  this.load.image("ground", "assets/ground.png");
  this.load.image("bullet", "assets/bala.png");
  this.load.image("gun", "assets/Gun.png");
  this.load.image("portal", "assets/Portal.png");
  this.load.image("BOST1", "assets/BOST1.png");
  this.load.image("BOST2", "assets/BOST2.png");
  this.load.image("BOST3", "assets/BOST3.png");

  //dude sprites
  this.load.spritesheet("dude", "assets/dude.png", {
    frameWidth: 320,
    frameHeight: 320,
  });
  this.load.spritesheet("dudeUp", "assets/dudeUp.png", {
    frameWidth: 320,
    frameHeight: 320,
  });

  //enemies sprites
  this.load.spritesheet("enemy", "assets/enemigo.png", {
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
  boosts = this.physics.add.group();

  boosts.create(300, 0, "BOST1").setScale(0.3).setBounce(0.5);
  boosts.create(500, 0, "BOST2").setScale(0.3).setBounce(0.5);
  boosts.create(700, 0, "BOST3").setScale(0.3).setBounce(0.5);

  this.add
    .image(0, 0, "sky")
    .setOrigin(0)
    .setDisplaySize(
      this.sys.game.config.width,
      this.sys.game.config.height - 30
    );

  platforms = this.physics.add.staticGroup();

  //plataformas centrales
  platforms.create(260, 600, "ground").setScale(1.4, 0.5).refreshBody(); //izquierda
  platforms.create(760, 600, "ground").setScale(0.7, 0.3).refreshBody(); //central
  platforms.create(1200, 600, "ground").setScale(0.7, 0.3).refreshBody(); //central derecha
  platforms.create(1700, 600, "ground").setScale(1.2, 0.5).refreshBody(); //derecha

  //plataforma central inferior
  platforms.create(900, 735, "ground").setScale(1, 0.5).refreshBody();
  platforms.create(1000, 735, "ground").setScale(1, 0.5).refreshBody();

  //piso inferior
  platforms.create(400, 935, "ground").setScale(2, 1).refreshBody(); //izquierda
  platforms.create(970, 935, "ground").setScale(0.5, 0.6).refreshBody(); //centro
  platforms.create(1550, 935, "ground").setScale(2, 1).refreshBody(); //derecha

  //portales
  this.portal = this.physics.add.staticGroup();

  portalPositions.forEach((pos) => {
    this.portal.create(pos.x, pos.y, "portal").setScale(0.4).refreshBody();
  });

  //player
  player = this.physics.add.sprite(100, 700, "dude", 0);
  spritePhysics(this, player, platforms);
  this.physics.add.collider(boosts, platforms);
  this.physics.add.overlap(
    player,
    boosts,
    (player, boost) => collectBoost(player, boost, this),
    null,
    this
  );

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

  //----animaciones enemigos
  this.anims.create({
    key: "enemyLeft",
    frames: this.anims.generateFrameNumbers("enemy", { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1,
  });

  this.anims.create({
    key: "enemyRight",
    frames: this.anims.generateFrameNumbers("enemy", { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1,
  });

  this.anims.create({
    key: "enemyTurn",
    frames: [{ key: "dude", frame: 4 }],
    frameRate: 20,
  });

  this.score = 0;
  this.scoreText = this.add.text(16, 16, "Puntuación: 0", {
    fontSize: "32px",
    fill: "#fff",
  });

  this.vidas = 3;
  this.vidasText = this.add.text(16, 50, "Vidas: " + this.vidas, {
    fontSize: "32px",
    fill: "#fff",
  });

  this.velocidadBoostActiva = false;

  //enemigos
  this.enemies = this.physics.add.group();

  cursors = this.input.keyboard.createCursorKeys();
  bullets = this.physics.add.group();

  spawnEnemies(this, portalPositions, platforms);

  this.puedePerderVida = true;
  this.escudoActivo = false;

  //collisions
  this.physics.add.overlap(bullets, this.enemies, hitEnemy, null, this);
  this.physics.add.overlap(player, this.enemies, playerHitByEnemy, null, this);
  this.physics.add.collider(bullets, platforms, destroyBullet, null, this);

  this.time.addEvent({
    delay: 15000,
    callback: () => spawnBoost(this, boosts),
    loop: true,
  });
}

function update() {
  this.weapon.setPosition(player.x, player.y);
  const velocidad = this.velocidadBoostActiva ? 300 : 160;

  //enemies
  EnemyFollowsPlayer(this, player, platforms);

  if (this.vidas <= 0) {
    this.add
      .text(960, 500, "Fin de la partida", {
        fontSize: "64px",
        fill: "#ff0000",
      })
      .setOrigin(0.5);
    player.setVelocityX(0);
    return;
  }

  // Animaciones y movimiento
  if (this.keyW.isDown && cursors.right.isDown) {
    executeActions(this, "lookUpRight", velocidad, player);
  } else if (this.keyW.isDown && cursors.left.isDown) {
    executeActions(this, "lookUpLeft", velocidad, player);
  } else if (cursors.left.isDown) {
    executeActions(this, "left", velocidad, player);
  } else if (cursors.right.isDown) {
    executeActions(this, "right", velocidad, player);
  } else if (this.keyW.isDown) {
    executeActions(this, "lookUp", velocidad, player);
  } else {
    executeActions(this, "turn", velocidad, player);
  }

  if (this.keyE.isDown && player.facing !== "turn") {
    const currentTime = this.time.now;

    //intervalo de tiempo entre disparo
    if (currentTime - this.lastShootTime > this.shootCooldown) {
      shootBullet(this, player, bullets);
      this.lastShootTime = currentTime;
    }
  }

  if (cursors.up.isDown && player.body.touching.down) {
    player.setVelocityY(-330);
  }

  // Limpiar balas que salen de la pantalla
  bullets.children.getArray().forEach((bullet) => {
    if (
      bullet.x < -100 ||
      bullet.x > 2020 ||
      bullet.y < -100 ||
      bullet.y > 1100
    ) {
      bullet.destroy();
    }
  });
}

