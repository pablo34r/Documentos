export function playerTakesDamageEffect(scene, player) {
  let flashCount = 0;
  const flashTimer = scene.time.addEvent({
    delay: 100,
    callback: () => {
      player.setAlpha(player.alpha === 1 ? 0.5 : 1);
      flashCount++;
      if (flashCount >= 15) {
        flashTimer.destroy();
        player.setAlpha(1);
      }
    },
    loop: true,
  });
}
