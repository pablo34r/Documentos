export function createDestroyEffect(scene, x, y) {
  for (let i = 0; i < 8; i++) {
    const particle = scene.add.rectangle(x, y, 6, 6, 0xff4444);
    const angle = (i / 8) * Math.PI * 2;
    const speed = 120 + Math.random() * 60;
    const endX = x + Math.cos(angle) * speed;
    const endY = y + Math.sin(angle) * speed;

    scene.tweens.add({
      targets: particle,
      x: endX,
      y: endY,
      scaleX: 0,
      scaleY: 0,
      alpha: 0,
      duration: 600,
      ease: "Power2",
      onComplete: () => {
        if (particle && particle.destroy) {
          particle.destroy();
        }
      },
    });
  }

  const flash = scene.add.circle(x, y, 15, 0xffffff, 0.8);
  scene.tweens.add({
    targets: flash,
    scaleX: 2,
    scaleY: 2,
    alpha: 0,
    duration: 200,
    ease: "Power2",
    onComplete: () => {
      if (flash && flash.destroy) {
        flash.destroy();
      }
    },
  });
}
