export function spawnBoss(scene) {
  scene.boss.setScale(1.2);
  scene.boss.anims.play("bossTurn", true);
  scene.boss.setCollideWorldBounds(true);
}