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
var stars;
var score = 0;
var scoreText;
var bombs;
var vidas = 3;
var vidasText;

function preload() {
  this.load.image("sky", "assets/sky.png");
  this.load.image("ground", "assets/ground.png");
  this.load.image("star", "assets/star.png");
  this.load.image("bomb", "assets/bomb.png");
  this.load.spritesheet("dude", "assets/dude.png", {
    frameWidth: 320,
    frameHeight: 320,
  });
}

function create() {
  this.add.image(400, 300, "sky").setScale(2, 2);

  platforms = this.physics.add.staticGroup();
  platforms.create(650, 220, "ground");
  platforms.create(100, 380, "ground");
  platforms.create(400, 568, "ground").setScale(2, 2).refreshBody();

  player = this.physics.add.sprite(100, 450, "dude", 0);
  player.setScale(0.2); // 👈 Reduce al 50% de su tamaño
  player.setCollideWorldBounds(true);
  player.setBounce(0.3);

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

  this.physics.add.collider(player, platforms);

  cursors = this.input.keyboard.createCursorKeys();

  stars = this.physics.add.group({
    key: "star",
    repeat: 8,
    setXY: { x: 12, y: 0, stepX: 70 },
  });

  stars.children.iterate(function (child) {
    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
  });

  this.physics.add.collider(stars, platforms);

  scoreText = this.add.text(16, 16, "Puntuación: 0", {
    fontSize: "32px",
    fill: "#000",
  });

  bombs = this.physics.add.group();

  this.physics.add.overlap(player, stars, collectStar, null, this);
  this.physics.add.overlap(player, bombs, hitBomb, null, this);

  // Crear el texto de las vidas
  vidasText = this.add.text(16, 50, "Vidas: 3", {
    fontSize: "32px",
    fill: "#000",
  });

  // Colisión de la bomba con las plataformas
  this.physics.add.collider(bombs, platforms);
}

function update() {
  if (vidas <= 0) {
    // Si no quedan vidas, mostrar mensaje de fin de la partida
    this.add
      .text(300, 250, "Fin de la partida", {
        fontSize: "64px",
        fill: "#ff0000",
      })
      .setOrigin(0.5);
    return; // No hacer nada más, se detiene el juego
  }

  if (cursors.left.isDown) {
    player.setVelocityX(-160);
    player.anims.play("left", true);
  } else if (cursors.right.isDown) {
    player.setVelocityX(160);
    player.anims.play("right", true);
  } else {
    player.setVelocityX(0);
    player.anims.play("turn");
  }

  if (cursors.up.isDown && player.body.touching.down) {
    player.setVelocityY(-330);
  }
}

function collectStar(player, star) {
  star.disableBody(true, true);

  score += 5;
  scoreText.setText("Puntuación: " + score);

  if (stars.countActive(true) === 0) {
    stars.children.iterate(function (child) {
      child.enableBody(true, child.x, 0, true, true);
    });
    generateBomb();
  }
}

function generateBomb() {
  var x = Phaser.Math.Between(100, 700);
  var bomb = bombs.create(x, 0, "bomb");
  bomb.setBounce(1);
  bomb.setCollideWorldBounds(true);
  bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
}

function hitBomb(player, bomb) {
  // Al tocar la bomba, no desactivarla, solo cambiar su color o hacer alguna otra acción si se desea
  bomb.setTint(0xff0000); // Cambiar color de la bomba para indicar que ha tocado al jugador

  // Restar una vida
  vidas -= 1;
  vidasText.setText("Vidas: " + vidas);

  if (vidas <= 0) {
    // Cuando el jugador se quede sin vidas, mostrar el mensaje de fin de partida
    player.setTint(0xff0000); // Cambiar color del jugador para indicar que ha perdido
  }
}