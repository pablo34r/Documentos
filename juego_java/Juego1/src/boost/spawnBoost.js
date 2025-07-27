export function spawnBoost(scene, boosts) {
  const tipos = ["BOST1", "BOST2", "BOST3"];
  const tipo = Phaser.Utils.Array.GetRandom(tipos);
  const x = Phaser.Math.Between(100, 700);

  const boost = boosts.create(x, 0, tipo);
  boost.setScale(0.3).setBounce(0.5);
}