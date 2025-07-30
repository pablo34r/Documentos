import { createDestroyEffect } from "../effects/createDestroyEffect.js";
import { destroyBullet } from "./destroyBullet.js";

export function hitEnemy(bullet, enemy) {
    const scene = enemy.scene;
    const enemyX = enemy.x;
    const enemyY = enemy.y;

    destroyBullet(bullet);

    // Si es un jefe (verificamos por el tipo de sprite)
    if (enemy.texture.key === 'boss') {
        enemy.health -= 1;
        
        if (enemy.health <= 0) {
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

