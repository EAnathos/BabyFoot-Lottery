import { dom } from "./dom.js";
import { state } from "./state.js";

const STUN_EFFECT_ID = 15;
const STUN_DURATION_SECONDS = 7;
const STUN_BUTTON_READY_LABEL = "Lancer le stun (7s)";
const STUN_BUTTON_RUNNING_LABEL = "Stun en cours...";
const STUN_BUTTON_DONE_LABEL = "Relancer le stun (7s)";
const STUN_TIMER_CLASS = "stun-timer";
let stunCountdownId = null;
let stunRunning = false;

function setBonusStatus(text, isActive) {
  const hasText = Boolean(text);
  dom.bonusStatus.textContent = text;
  dom.bonusStatus.classList.toggle("hidden", !hasText);
  if (!hasText) {
    dom.bonusStatus.classList.remove("active");
    dom.bonusStatus.classList.remove(STUN_TIMER_CLASS);
    dom.bonusStatus.style.removeProperty("--stun-progress");
    return;
  }
  if (isActive) {
    dom.bonusStatus.classList.add("active");
  } else {
    dom.bonusStatus.classList.remove("active");
  }
}

function setStunTimerProgress(progress) {
  const clamped = Math.max(0, Math.min(1, progress));
  dom.bonusStatus.style.setProperty("--stun-progress", clamped.toFixed(3));
  dom.bonusStatus.classList.add(STUN_TIMER_CLASS);
}

function setStunButtonVisibility(isVisible) {
  if (!dom.stunCountdownButton) {
    return;
  }
  dom.stunCountdownButton.classList.toggle("hidden", !isVisible);
}

function resetStunButton() {
  if (!dom.stunCountdownButton) {
    return;
  }
  dom.stunCountdownButton.disabled = false;
  dom.stunCountdownButton.textContent = STUN_BUTTON_READY_LABEL;
}

function clearStunCountdown() {
  if (stunCountdownId) {
    clearInterval(stunCountdownId);
    stunCountdownId = null;
  }
  stunRunning = false;
}

function startStunCountdown() {
  clearStunCountdown();

  let remaining = STUN_DURATION_SECONDS;
  stunRunning = true;
  setStunButtonVisibility(false);
  setStunTimerProgress(1);
  setBonusStatus(`Stun: ${remaining} s`, true);

  if (dom.stunCountdownButton) {
    dom.stunCountdownButton.disabled = true;
    dom.stunCountdownButton.textContent = STUN_BUTTON_RUNNING_LABEL;
  }

  stunCountdownId = setInterval(() => {
    remaining -= 1;
    if (remaining <= 0) {
      clearStunCountdown();
      setStunTimerProgress(0);
      setBonusStatus("Stun: 0 s", true);
      resetStunButton();
      return;
    }
    setStunTimerProgress(remaining / STUN_DURATION_SECONDS);
    setBonusStatus(`Stun: ${remaining} s`, true);
  }, 1000);
}

if (dom.stunCountdownButton) {
  dom.stunCountdownButton.addEventListener("click", () => {
    if (stunRunning) {
      return;
    }
    startStunCountdown();
  });
}

export function showLoadError() {
  clearStunCountdown();
  dom.effectName.textContent = "Chargement impossible";
  dom.effectDescription.textContent =
    "Ouvre la page avec un serveur local pour lire effects.json.";
  setStunButtonVisibility(false);
  setBonusStatus("", false);
  dom.resultDisplay.style.background = "rgba(17, 16, 26, 0.9)";
  dom.resultDisplay.classList.remove("hidden");
}

export function showResult(effectOrArray) {
  clearStunCountdown();
  let effects = Array.isArray(effectOrArray) ? effectOrArray : [effectOrArray];

  // Affichage combiné si deux effets
  if (effects.length === 2) {
    dom.effectName.textContent = `${effects[0].name} + ${effects[1].name}`;
    dom.effectDescription.innerHTML = `
    ${effects[0].description}
    ${effects[1].description}
    `;
    dom.resultDisplay.style.background = `linear-gradient(135deg, ${effects[0].color}88, ${effects[1].color}88, ${effects[0].color}44)`;
    if (dom.rarityBadge) {
      dom.rarityBadge.textContent = "Double Effet !";
      dom.rarityBadge.classList.remove("is-hidden");
    }
    // Affiche uniquement le bouton stun si besoin
    let hasStun = false;
    effects.forEach((effect) => {
      if (effect.id === STUN_EFFECT_ID) {
        setStunButtonVisibility(true);
        resetStunButton();
        hasStun = true;
      }
    });
    if (!hasStun) {
      setStunButtonVisibility(false);
    }
    setBonusStatus("", false);
  } else {
    const effect = effects[0];
    dom.effectName.textContent = effect.name;
    dom.effectDescription.textContent = effect.description;
    dom.resultDisplay.style.background = `linear-gradient(135deg, ${effect.color}88, ${effect.color}44)`;
    if (effect.id === STUN_EFFECT_ID) {
      setStunButtonVisibility(true);
      resetStunButton();
      setBonusStatus("", false);
    } else {
      setStunButtonVisibility(false);
      setBonusStatus("", false);
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
