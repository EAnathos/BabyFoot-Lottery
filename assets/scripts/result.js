import { dom } from "./dom.js";
import { state } from "./state.js";

export function showLoadError() {
  dom.effectName.textContent = "Chargement impossible";
  dom.effectDescription.textContent =
    "Ouvre la page avec un serveur local pour lire effects.json.";
  dom.bonusStatus.textContent = "";
  dom.bonusStatus.classList.remove("active");
  dom.resultDisplay.style.background = "rgba(17, 16, 26, 0.9)";
  dom.resultDisplay.classList.remove("hidden");
}

export function showResult(effect) {
  dom.effectName.textContent = effect.name;
  dom.effectDescription.textContent = effect.description;

  // Set background color based on effect
  dom.resultDisplay.style.background = `linear-gradient(135deg, ${effect.color}88, ${effect.color}44)`;

  if (typeof effect.goalsRequired === "number") {
    dom.bonusStatus.textContent = `⚡ Durée: ${effect.goalsRequired} but${effect.goalsRequired === 1 ? "" : "s"}`;
    dom.bonusStatus.classList.add("active");
  } else {
    dom.bonusStatus.textContent = "";
    dom.bonusStatus.classList.remove("active");
  }

  if (dom.rarityBadge) {
    if (effect.isNoWayy) {
      dom.rarityBadge.textContent = "No Wayyy *";
      dom.rarityBadge.classList.remove("is-hidden");
    } else if (effect.isLegendary) {
      dom.rarityBadge.textContent = "Légendaire *";
      dom.rarityBadge.classList.remove("is-hidden");
    } else if (effect.isRare) {
      dom.rarityBadge.textContent = "Rare *";
      dom.rarityBadge.classList.remove("is-hidden");
    } else {
      dom.rarityBadge.textContent = "Commun";
      dom.rarityBadge.classList.remove("is-hidden");
    }
  }

  dom.resultDisplay.classList.remove("hidden");
  dom.resultDisplay.classList.add("effect-flash");

  if (!state.hasSpun) {
    state.hasSpun = true;
    if (dom.wheelHint) {
      dom.wheelHint.classList.add("hidden");
    }
  }

  // Remove flash animation after it completes
  setTimeout(() => {
    dom.resultDisplay.classList.remove("effect-flash");
  }, 500);

  // Note: No auto-hide timer - bonus stays until goals are scored
}
