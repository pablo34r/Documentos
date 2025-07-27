import { createDestroyEffect } from "../effects/createDestroyEffect.js";

export function hitEnemy(bullet, enemy) {
  const enemyX = enemy.x;
  const enemyY = enemy.y;
  const scene = enemy.scene;

  bullet.destroy();
  enemy.destroy();

  // Aumentar puntuación
  scene.score += 100;
  scene.scoreText.setText("Puntuación: " + scene.score);

  // Crear efecto de destrucción
  createDestroyEffect(scene, enemyX, enemyY);
}
