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
import { spawnBoss } from "./enemies/boss.js";
import { BossFollowsPlayer } from "./enemies/bossFollorPlayer.js";


class CinematicaScene extends Phaser.Scene {
  constructor() {
    super({ key: 'CinematicaScene' });
  }

  preload() {
    this.load.video('intro', 'assets/videoInicial.mp4', 'loadeddata', false, true);
  }

  create() {
    // Cambia el tamaño del video aquí (por ejemplo, 960x540)
    const video = this.add.video(960, 500, 'intro').setOrigin(0.5);
    video.setDisplaySize(360, 200);

    video.play(true);
    video.setMute(false);

    // Saltar cinemática con click o tecla
    this.input.once('pointerdown', () => this.endCinematic(video));
    this.input.keyboard.once('keydown', () => this.endCinematic(video));

    // Cuando termina el video
    video.on('complete', () => this.endCinematic(video));
  }

  endCinematic(video) {
    video.stop();
    this.scene.start('MainScene');
  }
}

class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene' });
  }
  preload() { preload.call(this); }
  create() { create.call(this); }
  update() { update.call(this); }
}


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
  scene: [CinematicaScene, MainScene], // <-- Cambia aquí
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
  this.load.image("corazon", "assets/Corazon.png");

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

  //boss sprites
  this.load.spritesheet("boss", "assets/jefe.png", {
    frameWidth: 484,
    frameHeight: 516,
    margin: 0,
    spacing: 0,
  });
  this.load.video('intro', 'assets/videoInicial.mp4', 'loadeddata', false, true);
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

  this.waveCountdown = 30;
  this.waveText = this.add
    .text(16, 90, "Siguiente oleada en: 30s", {
      fontSize: "22px",
      fill: "#ffcc00",
    })
    .setScrollFactor(0);

  this.time.addEvent({
    delay: 1000,
    callback: () => {
      this.waveCountdown--;
      if (this.waveCountdown <= 0) {
        this.waveCountdown = 30;
        this.events.emit("nextWave");
      }
      this.waveText.setText("Siguiente oleada en: " + this.waveCountdown + "s");
    },
    loop: true,
  });

  //plataformas superiores
  platforms.create(230, 450, "ground").setScale(1.2, 0.5).refreshBody(); //izquierda
  platforms.create(1800, 450, "ground").setScale(1.2, 0.5).refreshBody(); //central

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
  player = this.physics.add.sprite(640, 541, "dude", 0);
  spritePhysics(this, player, platforms);
  this.physics.add.collider(boosts, platforms);
  this.physics.add.overlap(
    player,
    boosts,
    (player, boost) => collectBoost(player, boost, this),
    null,
    this
  );
  //Jefaso
this.maxBossHealth = 10;
this.bossHealth = this.maxBossHealth;
this.boss = null; // No crees el jefe aquí

// Barra de vida del jefe
this.bossHealthBar = this.add.graphics();
this.bossHealthBar.setScrollFactor(0);
this.updateBossHealthBar = () => {
  this.bossHealthBar.clear();
  const width = 600;
  const height = 20;
  const x = 660;
  const y = 20;
  this.bossHealthBar.fillStyle(0x555555, 1);
  this.bossHealthBar.fillRect(x, y, width, height);
  if (this.boss && this.boss.active) {
    const healthPercent = Phaser.Math.Clamp(this.bossHealth / this.maxBossHealth, 0, 1);
    this.bossHealthBar.fillStyle(0xff0000, 1);
    this.bossHealthBar.fillRect(x, y, width * healthPercent, height);
  }
};

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
    frames: this.anims.generateFrameNumbers("enemy", { start: 4, end: 7 }),
    frameRate: 10,
    repeat: -1,
  });

  this.anims.create({
    key: "enemyTurn",
    frames: [{ key: "enemy", frame: 4 }],
    frameRate: 20,
  });

  //boss animaciones
  this.anims.create({
    key: "bossTurn",
    frames: this.anims.generateFrameNumbers("boss", { start: 0, end: 6 }),
    frameRate: 10,
    repeat: -1,
  });

  this.score = 0;
  this.scoreText = this.add.text(16, 16, "Puntuación: 0", {
    fontSize: "32px",
    fill: "#fff",
  });

  this.vidas = 1000;
  this.vidasText = this.add.text(60, 50, "x " + this.vidas, {
    fontSize: "32px",
    fill: "#fff",
  });
  this.corazonIcon = this.add
    .image(35, 73, "corazon")
    .setScale(1.8)
    .setScrollFactor(0);

  this.velocidadBoostActiva = false;

  //enemigos
  this.enemies = this.physics.add.group();

  this.currentWave = 1;
  this.maxBossHealth = 10;
  this.bossHealth = this.maxBossHealth;
  this.boss = null; // No crees el jefe aquí

  // Barra de vida del jefe
  this.bossHealthBar = this.add.graphics();
  this.bossHealthBar.setScrollFactor(0);
  this.updateBossHealthBar = () => {
    this.bossHealthBar.clear();
    const width = 600;
    const height = 20;
    const x = 660;
    const y = 20;
    this.bossHealthBar.fillStyle(0x555555, 1);
    this.bossHealthBar.fillRect(x, y, width, height);
    if (this.boss && this.boss.active) {
      const healthPercent = Phaser.Math.Clamp(this.bossHealth / this.maxBossHealth, 0, 1);
      this.bossHealthBar.fillStyle(0xff0000, 1);
      this.bossHealthBar.fillRect(x, y, width * healthPercent, height);
    }
  };

  const spawnWaveEnemies = (wave) => {
    const cantidad = wave === 1 ? 5 : wave === 2 ? 8 : 12;
    const posiciones = Phaser.Utils.Array.Shuffle([...portalPositions]);
    for (let i = 0; i < cantidad; i++) {
      const pos = posiciones[i % posiciones.length];
      spawnEnemies(this, [pos], platforms);
    }
  };

  this.events.on("nextWave", () => {
    if (this.currentWave === 4) {
      // Spawnea el jefe
      this.boss = this.physics.add.sprite(1500, 500, "boss", 0);
      this.boss.body.setSize(250, 250);
      this.boss.setOffset(135, 110);
      this.bossHealth = this.maxBossHealth;
      spawnBoss(this);
      this.updateBossHealthBar();
      this.physics.add.overlap(bullets, this.boss, hitEnemy, null, this);
      this.physics.add.overlap(player, this.boss, playerHitByEnemy, null, this);
      this.waveText.setText("¡JEFE FINAL!");
      this.currentWave++;
      return;
    }
    if (this.currentWave > 4) {
      this.waveText.setText("Todas las oleadas completadas");
      return;
    }
    this.waveText.setText(`¡Oleada ${this.currentWave}!`);
    spawnWaveEnemies(this.currentWave);
    this.currentWave++;
  });

  // Inicia la primera oleada
  this.events.emit("nextWave");

  cursors = this.input.keyboard.createCursorKeys();
  bullets = this.physics.add.group();

  this.puedePerderVida = true;
  this.escudoActivo = false;

  //collisions
  this.physics.add.overlap(bullets, this.enemies, hitEnemy, null, this);
  this.physics.add.overlap(bullets, this.boss, hitEnemy, null, this);
  this.physics.add.overlap(player, this.enemies, playerHitByEnemy, null, this);
  this.physics.add.overlap(player, this.boss, playerHitByEnemy, null, this);
  this.physics.add.collider(bullets, platforms, destroyBullet, null, this);

  this.time.addEvent({
    delay: 15000,
    callback: () => spawnBoost(this, boosts),
    loop: true,
  });

  this.juegoTerminado = false;
}

function update() {
  this.weapon.setPosition(player.x, player.y);
  const velocidad = this.velocidadBoostActiva ? 300 : 160;

  //enemies
  EnemyFollowsPlayer(this, player, platforms);

  if (this.vidas <= 0 && !this.juegoTerminado) {
    this.juegoTerminado = true;

    // Mostrar mensaje de fin
    this.add
      .text(960, 500, "Fin de la partida", {
        fontSize: "64px",
        fill: "#ff0000",
      })
      .setOrigin(0.5);

    // Eliminar jugador
    player.setTint(0xff0000);
    player.anims.stop();
    player.setVelocity(0);

    // Detener nuevas oleadas
    this.events.off("nextWave");

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

  if (this.boss && this.boss.active) {
    BossFollowsPlayer(this, player);
  }
}
// function actualizarFaseBoss(scene) {
//   if (scene.bossHealth <= 750 && scene.bossHealth > 500) {
//     // Fase 1: velocidad media
//     scene.boss.setVelocityX(150);
//     scene.boss.setTint(0xffff00); // amarillo
//   } else if (scene.bossHealth <= 500 && scene.bossHealth > 250) {
//     // Fase 2: más agresivo
//     scene.boss.setVelocityX(250);
//     scene.boss.setTint(0xff9900); // naranja
//   } else if (scene.bossHealth <= 250) {
//     // Fase 3: velocidad máxima
//     scene.boss.setVelocityX(350);
//     scene.boss.setTint(0xff0000); // rojo
//   }
// }

