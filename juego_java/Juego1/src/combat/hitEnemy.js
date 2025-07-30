import { createDestroyEffect } from "../effects/createDestroyEffect.js";

function actualizarFaseBoss(scene) {
  const health = scene.bossHealth;

  if (health <= 750 && health > 500) {
    scene.boss.setVelocityX(150);
    scene.boss.setTint(0xffff00);
  } else if (health <= 500 && health > 250) {
    scene.boss.setVelocityX(250);
    scene.boss.setTint(0xff9900);
  } else if (health <= 250) {
    scene.boss.setVelocityX(350);
    scene.boss.setTint(0xff0000);
  }
}

export function hitEnemy(bullet, enemy) {
  const scene = enemy.scene;
  const enemyX = enemy.x;
  const enemyY = enemy.y;

  bullet.destroy();

  if (enemy.isBoss) {
    scene.bossHealth -= 50;
    scene.updateBossHealthBar();
    createDestroyEffect(scene, enemyX, enemyY);

    if (scene.bossHealth <= 0) {
      enemy.destroy();
      scene.score += 500;
      scene.scoreText.setText("Puntuación: " + scene.score);
      scene.bossHealth = 0;
      scene.updateBossHealthBar();
    } else {
      actualizarFaseBoss(scene);
    }

    return;
  }

  enemy.health -= 1;

  if (enemy.health <= 0) {
    enemy.destroy();
    scene.score += 100;
    scene.scoreText.setText("Puntuación: " + scene.score);
  }

  createDestroyEffect(scene, enemyX, enemyY);
}

