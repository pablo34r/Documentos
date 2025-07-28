import { dudeConfigs } from "../configs/dudeConfigs.js";

export function executeActions(scene, action, velocidad, player) {
  const configDude = dudeConfigs[action];
  if (!configDude) return;

  player.anims.play(configDude.action, true);
  let velocidadX = 0;
  if (action === "left" || action === "lookUpLeft") {
    velocidadX = scene.velocidadBoostActiva ? -300 : -160;
  } else if (action === "right" || action === "lookUpRight") {
    velocidadX = scene.velocidadBoostActiva ? 300 : 160;
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
  // console.log("X: ", player.x, "Y: ", player.y);
}
