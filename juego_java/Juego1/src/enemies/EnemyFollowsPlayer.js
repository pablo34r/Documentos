export function EnemyFollowsPlayer(scene, player, platforms) {
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
