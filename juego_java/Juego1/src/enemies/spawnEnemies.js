import spritePhysics from "../auxiliary/spritePhysics.js";

export function spawnEnemies(scene, positions, platforms) {
  positions.forEach((pos) => {
    const enemy = scene.enemies.create(pos.x + 100, pos.y, "enemy");
    spritePhysics(scene, enemy, platforms);
    enemy.health = 3; // <-- Inicializa la vida aquí
  });
}
