import { createDestroyEffect } from "../effects/createDestroyEffect.js";

export function hitEnemy(bullet, enemy) {
  const enemyX = enemy.x;
  const enemyY = enemy.y;
  const scene = enemy.scene;

  bullet.destroy();
  if (enemy.health <= 0) {
    enemy.destroy();
    scene.score += 100;
    scene.scoreText.setText("Puntuación: " + scene.score);
  } else {
    enemy.health -= 1;
  }
  createDestroyEffect(scene, enemyX, enemyY);
}
