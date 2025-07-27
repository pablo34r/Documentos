const config = {
  type: Phaser.AUTO,
  width: 1920,
  height: 1000,
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

const jumpPoints = [
  { x: 500, y: 849 },
  { x: 1350, y: 849 },
  { x: 803, y: 849 },
  { x: 1158, y: 849 },
  { x: 1070, y: 870.6 },
  { x: 881, y: 870.6 },
];

var game = new Phaser.Game(config);

var player;
var platforms;
var cursors;
var bullets;
var score = 0;
var scoreText;
var vidas = 3;
var vidasText;
var puedePerderVida = true;
var boosts;
var velocidadBoostActiva = false;
var escudoActivo = false;

function preload() {
  this.load.image("sky", "assets/Luna pixelart.png");
  this.load.image("ground", "assets/ground.png");
  this.load.image("bullet", "assets/bala.png");
  this.load.image("gun", "assets/Gun.png");
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
  this.load.spritesheet("enemy", "assets/dude.png", {
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

  platforms.create(900, 735, "ground").setScale(1, 0.5).refreshBody();
  platforms.create(1000, 735, "ground").setScale(1, 0.5).refreshBody();

  //piso inferior
  platforms.create(400, 935, "ground").setScale(2, 1).refreshBody(); //izquierda
  platforms.create(970, 935, "ground").setScale(0.5, 0.6).refreshBody(); //centro
  platforms.create(1550, 935, "ground").setScale(2, 1).refreshBody(); //derecha

  //player
  player = this.physics.add.sprite(100, 700, "dude", 0);
  spritePhysics(this, player);
  this.physics.add.collider(boosts, platforms);
  this.physics.add.overlap(player, boosts, collectBoost, null, this);

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

  scoreText = this.add.text(16, 16, "Puntuación: 0", {
    fontSize: "32px",
    fill: "#fff",
  });

  vidasText = this.add.text(16, 50, "Vidas: " + vidas, {
    fontSize: "32px",
    fill: "#fff",
  });

  //enemigos
  this.enemies = this.physics.add.group();

  cursors = this.input.keyboard.createCursorKeys();
  bullets = this.physics.add.group();

  //spawn enemies
  const enemyPositions = [
    { x: 2000, y: 800 },
    { x: 1800, y: 800 },
  ];
  spawnEnemies(this, enemyPositions);

  //collisions
  this.physics.add.overlap(bullets, this.enemies, hitEnemy, null, this);
  this.physics.add.overlap(player, this.enemies, playerHitByEnemy, null, this);
  this.physics.add.collider(bullets, platforms, destroyBullet, null, this);

  this.time.addEvent({
    delay: 15000,
    callback: () => spawnBoost(this),
    loop: true,
  });
}

function update() {
  this.weapon.setPosition(player.x, player.y);
  const velocidad = velocidadBoostActiva ? 300 : 160;

  //enemies
  EnemyFollowsPlayer(this);

  if (vidas <= 0) {
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
    executeActions(this, "lookUpRight", velocidad);
  } else if (this.keyW.isDown && cursors.left.isDown) {
    executeActions(this, "lookUpLeft", velocidad);
  } else if (cursors.left.isDown) {
    executeActions(this, "left", velocidad);
  } else if (cursors.right.isDown) {
    executeActions(this, "right", velocidad);
  } else if (this.keyW.isDown) {
    executeActions(this, "lookUp", velocidad);
  } else {
    executeActions(this, "turn", velocidad);
  }

  if (this.keyE.isDown && player.facing !== "turn") {
    const currentTime = this.time.now;

    //intervalo de tiempo entre disparo
    if (currentTime - this.lastShootTime > this.shootCooldown) {
      shootBullet(this);
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

function executeActions(scene, action, velocidad) {
  const configDude = dudeConfigs[action];
  if (!configDude) return;

  player.anims.play(configDude.action, true);

  // Fixed: Using velocidad parameter properly and scale it with boost
  let velocidadX = 0;
  if (action === "left" || action === "lookUpLeft") {
    velocidadX = velocidadBoostActiva ? -300 : -160;
  } else if (action === "right" || action === "lookUpRight") {
    velocidadX = velocidadBoostActiva ? 300 : 160;
  }

  player.setVelocityX(velocidadX);
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
function shootBullet(scene) {
  const config = bulletConfigs[player.facing];
  if (!config) return;

  const bulletX = player.x + config.offsetX;
  const bulletY = player.y + config.offsetY;

  const bullet = bullets.create(bulletX, bulletY, "bullet");
  bullet.body.setAllowGravity(false);
  bullet.setScale(0.05, 0.1);
  bullet.setVelocity(config.velocityX, config.velocityY);
  bullet.setFlipX(config.flipX);
  bullet.rotation = Phaser.Math.DegToRad(config.rotation);

  bullet.damage = 1;
}

function spawnEnemies(scene, positions) {
  positions.forEach((pos) => {
    const enemy = scene.enemies.create(pos.x, pos.y, "enemy");
    spritePhysics(scene, enemy);

    enemy.health = 3;
    enemy.damage = 1;
  });
}

function spritePhysics(scene, sprite) {
  sprite.setCollideWorldBounds(true);
  sprite.setScale(0.2);
  sprite.setBounce(0.2);
  scene.physics.add.collider(sprite, platforms);
}

function EnemyFollowsPlayer(scene) {
  scene.enemies.getChildren().forEach((enemy) => {
    const speed = 100;
    const jumpForce = -330;

    // Calcular distancia al jugador
    const distanceX = Math.abs(player.x - enemy.x);
    const distanceY = player.y - enemy.y;

    // Movimiento horizontal SIEMPRE hacia el jugador
    if (player.x < enemy.x) {
      enemy.setVelocityX(-speed);
      enemy.play("enemyLeft", true);
    } else if (player.x > enemy.x) {
      enemy.setVelocityX(speed);
      enemy.play("enemyRight", true);
    } else {
      enemy.setVelocityX(0);
      enemy.play("enemyTurn", true);
    }

    // salto para superar obstáculos
    if (enemy.body.blocked.down) {
      // Verificar si hay un obstáculo delante
      const direction = player.x > enemy.x ? 1 : -1;
      const checkDistance = 80;

      const obstacleAhead = scene.physics
        .overlapRect(
          enemy.x + (direction * checkDistance) / 2,
          enemy.y - enemy.height / 2,
          checkDistance,
          enemy.height
        )
        .some((obj) => obj.gameObject && platforms.contains(obj.gameObject));

      // Verificar si NO hay techo encima
      const ceilingAbove = scene.physics
        .overlapRect(
          enemy.x - enemy.width / 2,
          enemy.y - enemy.height - 10,
          enemy.width,
          10
        )
        .some((obj) => obj.gameObject && platforms.contains(obj.gameObject));

      // Saltar si hay obstáculo adelante
      const shouldJump =
        (obstacleAhead || // Hay obstáculo adelante
          distanceY < -50 || // Jugador está arriba
          (distanceX < 1000 && distanceY < -20)) && // Jugador cerca y un poco arriba
        !ceilingAbove; // Y no hay techo encima

      if (shouldJump) {
        enemy.setVelocityY(jumpForce);
      }
    }
  });
}

//----- Funciones del combate ----
function hitEnemy(bullet, enemy) {
  // Guardar la posición del enemigo antes de destruirlo
  const enemyX = enemy.x;
  const enemyY = enemy.y;
  const scene = enemy.scene;

  // Destruir la bala
  bullet.destroy();

  // Destruir el enemigo
  enemy.destroy();

  // Aumentar puntuación
  score += 100;
  scoreText.setText("Puntuación: " + score);

  // Crear efecto de destrucción
  createDestroyEffect(scene, enemyX, enemyY);
}

// Función cuando un enemigo toca al jugador
function playerHitByEnemy(player, enemy) {
  if (!puedePerderVida || escudoActivo) return; // Fixed: Check shield status

  vidas--;
  vidasText.setText("Vidas: " + vidas);

  // Fixed: Pass the scene context properly
  playerTakeDamageEffect(player.scene, player);

  // knockback
  const knockbackForce = 200;
  const direction = player.x > enemy.x ? 1 : -1;
  player.setVelocityX(direction * knockbackForce);
  player.setVelocityY(-150);
  puedePerderVida = false;

  const scene = player.scene;
  scene.time.delayedCall(1500, () => {
    puedePerderVida = true;
  });

  let flashCount = 0;
  const flashInterval = setInterval(() => {
    player.setAlpha(player.alpha === 1 ? 0.3 : 1);
    flashCount++;
    if (flashCount >= 10) {
      clearInterval(flashInterval);
      player.setAlpha(1);
    }
  }, 150);
}

// Función cuando una bala toca una plataforma
function destroyBullet(bullet, platform) {
  bullet.destroy();
}

// Efecto visual cuando un enemigo es destruido
function createDestroyEffect(scene, x, y) {
  for (let i = 0; i < 8; i++) {
    const particle = scene.add.rectangle(x, y, 6, 6, 0xff4444);
    const angle = (i / 8) * Math.PI * 2;
    const speed = 120 + Math.random() * 60;

    // Calcular posición final
    const endX = x + Math.cos(angle) * speed;
    const endY = y + Math.sin(angle) * speed;

    // Crear tween más dinámico
    scene.tweens.add({
      targets: particle,
      x: endX,
      y: endY,
      scaleX: 0,
      scaleY: 0,
      alpha: 0,
      duration: 600,
      ease: "Power2",
      onComplete: () => {
        if (particle && particle.destroy) {
          particle.destroy();
        }
      },
    });
  }

  // Agregar un flash central
  const flash = scene.add.circle(x, y, 15, 0xffffff, 0.8);
  scene.tweens.add({
    targets: flash,
    scaleX: 2,
    scaleY: 2,
    alpha: 0,
    duration: 200,
    ease: "Power2",
    onComplete: () => {
      if (flash && flash.destroy) {
        flash.destroy();
      }
    },
  });
}

// Efecto visual cuando el jugador recibe daño
function playerTakeDamageEffect(scene, player) {
  let flashCount = 0;
  const flashTimer = scene.time.addEvent({
    delay: 100,
    callback: () => {
      player.setAlpha(player.alpha === 1 ? 0.5 : 1);
      flashCount++;
      if (flashCount >= 15) {
        flashTimer.destroy();
        player.setAlpha(1); // Asegurar que quede visible
      }
    },
    loop: true,
  });
}

function collectBoost(player, boost) {
  const tipo = boost.texture.key;

  if (tipo === "BOST1") {
    vidas += 1;
    vidasText.setText("Vidas: " + vidas);
  } else if (tipo === "BOST2") {
    escudoActivo = true;
    player.setTint(0x00ffff);
    // Fixed: Use Phaser's timer instead of setTimeout
    player.scene.time.delayedCall(10000, () => {
      escudoActivo = false;
      player.clearTint();
    });
  } else if (tipo === "BOST3") {
    velocidadBoostActiva = true;
    // Fixed: Use Phaser's timer instead of setTimeout
    player.scene.time.delayedCall(10000, () => {
      velocidadBoostActiva = false;
    });
  }

  boost.disableBody(true, true);
}

function spawnBoost(scene) {
  const tipos = ["BOST1", "BOST2", "BOST3"];
  const tipo = Phaser.Utils.Array.GetRandom(tipos);
  const x = Phaser.Math.Between(100, 700);

  const boost = boosts.create(x, 0, tipo);
  boost.setScale(0.3).setBounce(0.5);
}
