export function spawnBoss(boss) {
    boss.anims.play("bossTurn", true);
    boss.setCollideWorldBounds(true);
}