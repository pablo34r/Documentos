export function BossFollowsPlayer(scene, player) {
  const speed = 120;
  const boss = scene.boss;

  // Calcular dirección hacia el jugador
  const dx = player.x - boss.x;
  const dy = player.y - boss.y;
  const length = Math.sqrt(dx * dx + dy * dy);

  // Normalizar y aplicar velocidad constante
  if (length > 0) {
    boss.setVelocityX((dx / length) * speed);
    boss.setVelocityY((dy / length) * speed);
  } else {
    boss.setVelocityX(0);
    boss.setVelocityY(0);
  }
}
