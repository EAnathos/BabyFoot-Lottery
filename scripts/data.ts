import { state } from "./state.js";
import {
  DEFAULT_WEIGHT,
  RARE_WEIGHT,
  LEGENDARY_WEIGHT,
  NO_WAYY_WEIGHT,
} from "./constants.js";
import { shuffleEffects } from "./utils.js";
import { resizeCanvas, drawWheel, updateSpinButton } from "./wheel.js";
import { renderProbabilities, showProbabilitiesLoadError } from "./probabilities.js";
import { renderRules, showRulesLoadError } from "./rules.js";
import { showLoadError } from "./result.js";

export function loadEffects() {
  fetch("data/effects.json", { cache: "no-store" })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      if (!Array.isArray(data.effects) || data.effects.length === 0) {
        throw new Error("Invalid effects.json format");
      }
      const randomizedEffects = shuffleEffects(data.effects);
      state.effects = randomizedEffects.map((effect) => {
        const baseWeight =
          typeof effect.weight === "number" ? effect.weight : DEFAULT_WEIGHT;
        const weight = Math.max(0, baseWeight);
        const isNoWayy = weight === NO_WAYY_WEIGHT;
        const isLegendary = weight === LEGENDARY_WEIGHT;
        const isRare = weight <= RARE_WEIGHT && weight > LEGENDARY_WEIGHT;
        // On retire goalsRequired si présent
        const { goalsRequired, ...rest } = effect;
        return {
          ...rest,
          isNoWayy,
          isRare,
          isLegendary,
          weight,
        };
      });
      resizeCanvas();
      drawWheel(0);
      updateSpinButton();
      renderProbabilities();
    })
    .catch((error) => {
      console.error("Error loading effects:", error);
      state.effects = [];
      resizeCanvas();
      drawWheel(0);
      updateSpinButton();
      showLoadError();
      showProbabilitiesLoadError();
    });
}

export function loadRules() {
  fetch("data/rules.json", { cache: "no-store" })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      if (!Array.isArray(data.rules)) {
        throw new Error("Invalid rules.json format");
      }
      renderRules(data.rules);
    })
    .catch((error) => {
      console.error("Error loading rules:", error);
      showRulesLoadError();
    });
}
