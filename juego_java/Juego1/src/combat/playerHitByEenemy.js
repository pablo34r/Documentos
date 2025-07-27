import { playerTakesDamageEffect } from "../effects/playerTakeDamageEffect.js";

export function playerHitByEnemy(player, enemy) {
  const scene = player.scene;

  if (!scene.puedePerderVida || scene.escudoActivo) return;

  scene.vidas--;
  scene.vidasText.setText("Vidas: " + scene.vidas);

  playerTakesDamageEffect(scene, player);

  // knockback
  const knockbackForce = 200;
  const direction = player.x > enemy.x ? 1 : -1;
  player.setVelocityX(direction * knockbackForce);
  player.setVelocityY(-150);
  scene.puedePerderVida = false;

  scene.time.delayedCall(1500, () => {
    scene.puedePerderVida = true;
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
