export default function spritePhysics(scene, sprite, platforms) {
  sprite.setCollideWorldBounds(true);
  sprite.setScale(0.2);
  sprite.setBounce(0.2);
  scene.physics.add.collider(sprite, platforms);
}
