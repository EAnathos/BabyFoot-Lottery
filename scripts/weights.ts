import { state } from "./state.js";
import { DEFAULT_WEIGHT } from "./constants.js";

export function getWeightMeta() {
  const weights = state.effects.map((effect) => {
    if (typeof effect.weight === "number") {
      return Math.max(0, effect.weight);
    }
    return DEFAULT_WEIGHT;
  });
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  const anglePerWeight = totalWeight > 0 ? (2 * Math.PI) / totalWeight : 0;
  return { weights, totalWeight, anglePerWeight };
}

export function getRotationForIndex(targetIndex) {
  const { weights, anglePerWeight, totalWeight } = getWeightMeta();
  if (totalWeight <= 0) {
    return 0;
  }

  let cumulativeAngle = 0;
  for (let index = 0; index < targetIndex; index += 1) {
    cumulativeAngle += weights[index] * anglePerWeight;
  }
  const targetAngle =
    cumulativeAngle + (weights[targetIndex] * anglePerWeight) / 2;
  const targetRotation = 2 * Math.PI - targetAngle;
  return ((targetRotation % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
}

export function pickWeightedEffect() {
  const totalWeight = state.effects.reduce((sum, effect) => {
    const weight =
      typeof effect.weight === "number" ? Math.max(0, effect.weight) : 0;
    return sum + weight;
  }, 0);

  if (totalWeight <= 0) {
    return state.effects[0];
  }

  let roll = Math.random() * totalWeight;
  for (const effect of state.effects) {
    const weight =
      typeof effect.weight === "number" ? Math.max(0, effect.weight) : 0;
    roll -= weight;
    if (roll <= 0) {
      return effect;
    }
  }

  return state.effects[state.effects.length - 1];
}
