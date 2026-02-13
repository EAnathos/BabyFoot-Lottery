export function getRarityLabel(effect) {
  if (effect.isNoWayy) {
    return "no-wayy";
  }
  if (effect.isLegendary) {
    return "legendary";
  }
  if (effect.isRare) {
    return "rare";
  }
  return "common";
}

export function getRarityRank(effect) {
  if (effect.isNoWayy) {
    return 3;
  }
  if (effect.isLegendary) {
    return 2;
  }
  if (effect.isRare) {
    return 1;
  }
  return 0;
}

export function getRarityDisplay(effect) {
  if (effect.isNoWayy) {
    return "No Wayyy";
  }
  if (effect.isLegendary) {
    return "Legendaire";
  }
  if (effect.isRare) {
    return "Rare";
  }
  return "Commun";
}
