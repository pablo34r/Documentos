import { bulletConfigs } from "../configs/bulletConfigs.js";

export function shootBullet(scene, player, bullets) {
  const config = bulletConfigs[player.facing];
  if (!config) return;

  const bulletX = player.x + config.offsetX;
  const bulletY = player.y + config.offsetY;

  const bullet = bullets.create(bulletX, bulletY, "bullet");
  bullet.body.setAllowGravity(false);
  bullet.setScale(0.05, 0.1);
  bullet.setVelocity(config.velocityX, config.velocityY);
  bullet.setFlipX(config.flipX);
  bullet.rotation = Phaser.Math.DegToRad(config.rotation);

  bullet.damage = 1;
}
