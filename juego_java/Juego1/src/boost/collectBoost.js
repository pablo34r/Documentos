export function collectBoost(player, boost, scene) {
  const tipo = boost.texture.key;

  if (tipo === "BOST1") {
    scene.vidas += 1;
    scene.vidasText.setText("Vidas: " + scene.vidas);
  } else if (tipo === "BOST2") {
    scene.escudoActivo = true;
    player.setTint(0x00ffff);
    scene.time.delayedCall(10000, () => {
      scene.escudoActivo = false;
      player.clearTint();
    });
  } else if (tipo === "BOST3") {
    scene.velocidadBoostActiva = true;
    scene.time.delayedCall(10000, () => {
      scene.velocidadBoostActiva = false;
    });
  }

  boost.disableBody(true, true);
}
