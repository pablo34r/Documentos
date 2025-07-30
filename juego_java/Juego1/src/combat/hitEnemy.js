import { createDestroyEffect } from "../effects/createDestroyEffect.js";
import { destroyBullet } from "./destroyBullet.js";

export function hitEnemy(bullet, enemy) {
  const scene = enemy.scene;
  const enemyX = enemy.x;
  const enemyY = enemy.y;

  destroyBullet(bullet);

  // Si es el jefe
  if (enemy === scene.boss) {
    scene.bossHealth -= 1;
    if (scene.updateBossHealthBar) scene.updateBossHealthBar();

    if (scene.bossHealth <= 0) {
      enemy.destroy();
      scene.score += 1000;
      scene.scoreText.setText("Puntuación: " + scene.score);
    }
    createDestroyEffect(scene, enemyX, enemyY);
    return;
  }

  // Enemigos normales
  enemy.health -= 1;
  if (enemy.health <= 0) {
    enemy.destroy();
    scene.score += 100;
    scene.scoreText.setText("Puntuación: " + scene.score);
  }

  createDestroyEffect(scene, enemyX, enemyY);
}
