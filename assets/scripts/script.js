// Load effects from JSON
let effects = [];
let isSpinning = false;
let wheelRadius = 200;
let centerCircleRadius = 30;
let currentRotation = 0;
let hasSpun = false;

// Canvas setup
const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");
const resultDisplay = document.getElementById("resultDisplay");
const effectName = document.getElementById("effectName");
const effectDescription = document.getElementById("effectDescription");
const bonusStatus = document.getElementById("bonusStatus");
const rarityBadge = document.getElementById("rarityBadge");
const wheelHint = document.querySelector(".wheel-hint");
const cheatBlue = document.getElementById("cheatBlue");
const cheatRed = document.getElementById("cheatRed");
const fullscreenToggle = document.getElementById("fullscreenToggle");
const rulesToggle = document.getElementById("rulesToggle");
const rulesModal = document.getElementById("rulesModal");
const rulesList = document.getElementById("rulesList");

// Configuration constants
const MIN_SPIN_DURATION = 2000;
const SPIN_DURATION_VARIANCE = 2000;
const MIN_ROTATIONS = 5;
const ROTATION_VARIANCE = 5;
const DEFAULT_WEIGHT = 10;
const RARE_WEIGHT = 5;
const LEGENDARY_WEIGHT = 2;
const NO_WAYY_WEIGHT = 1;

// Load effects data
fetch("assets/data/effects.json", { cache: "no-store" })
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
    effects = randomizedEffects.map((effect) => {
      const baseWeight =
        typeof effect.weight === "number" ? effect.weight : DEFAULT_WEIGHT;
      const weight = Math.max(0, baseWeight);
      const isNoWayy = weight === NO_WAYY_WEIGHT;
      const isLegendary = weight == LEGENDARY_WEIGHT;
      const isRare = weight <= RARE_WEIGHT && weight > LEGENDARY_WEIGHT;
      return {
        ...effect,
        isNoWayy,
        isRare,
        isLegendary,
        weight,
      };
    });
    resizeCanvas();
    drawWheel(0);
    updateSpinButton();
  })
  .catch((error) => {
    console.error("Error loading effects:", error);
    effects = [];
    resizeCanvas();
    drawWheel(0);
    updateSpinButton();
    showLoadError();
  });

fetch("assets/data/rules.json", { cache: "no-store" })
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

function shuffleEffects(effectList) {
  const shuffled = [...effectList];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [
      shuffled[swapIndex],
      shuffled[index],
    ];
  }
  return shuffled;
}

function showLoadError() {
  effectName.textContent = "Chargement impossible";
  effectDescription.textContent =
    "Ouvre la page avec un serveur local pour lire effects.json.";
  bonusStatus.textContent = "";
  bonusStatus.classList.remove("active");
  resultDisplay.style.background = "rgba(17, 16, 26, 0.9)";
  resultDisplay.classList.remove("hidden");
}

function renderRules(rules) {
  if (!rulesList) {
    return;
  }
  rulesList.innerHTML = "";
  rules.forEach((rule) => {
    const listItem = document.createElement("li");
    listItem.textContent = String(rule);
    rulesList.appendChild(listItem);
  });
}

function showRulesLoadError() {
  if (!rulesList) {
    return;
  }
  rulesList.innerHTML = "";
  const listItem = document.createElement("li");
  listItem.textContent = "Impossible de charger rules.json.";
  rulesList.appendChild(listItem);
}

function resizeCanvas() {
  const maxSize = Math.min(window.innerWidth * 0.78, 520);
  const size = Math.max(240, Math.floor(maxSize));
  canvas.width = size;
  canvas.height = size;
  wheelRadius = Math.max(120, Math.floor(size / 2 - 18));
  centerCircleRadius = Math.max(18, Math.floor(size * 0.06));
}

// Draw the wheel
function drawWheel(rotation = 0) {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const numSegments = effects.length;
  const { weights, totalWeight, anglePerWeight } = getWeightMeta();

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (numSegments === 0) {
    return;
  }

  // Draw segments
  let cumulativeAngle = 0;
  effects.forEach((effect, index) => {
    const segmentWeight = weights[index];
    const segmentAngle = segmentWeight * anglePerWeight;
    const startAngle = rotation + cumulativeAngle;
    const endAngle = rotation + cumulativeAngle + segmentAngle;

    // Draw segment
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, wheelRadius, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = effect.color;
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.65)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Draw text
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(startAngle + segmentAngle / 2);
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    const fontSize = Math.max(12, Math.floor(wheelRadius * 0.085));
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.shadowBlur = 3;
    ctx.fillText(effect.name, wheelRadius * 0.65, 5);
    ctx.restore();

    cumulativeAngle += segmentAngle;
  });

  // Draw center circle
  ctx.beginPath();
  ctx.arc(centerX, centerY, centerCircleRadius, 0, 2 * Math.PI);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.strokeStyle = "#333";
  ctx.lineWidth = 3;
  ctx.stroke();
}

// Update spin button state
function updateSpinButton() {
  // No button anymore; keep API for enabling/disabling spin via click.
}

function getRotationForIndex(targetIndex) {
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

function getWeightMeta() {
  const weights = effects.map((effect) => {
    if (typeof effect.weight === "number") {
      return Math.max(0, effect.weight);
    }
    return DEFAULT_WEIGHT;
  });
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  const anglePerWeight = totalWeight > 0 ? (2 * Math.PI) / totalWeight : 0;
  return { weights, totalWeight, anglePerWeight };
}

function pickWeightedEffect() {
  const totalWeight = effects.reduce((sum, effect) => {
    const weight =
      typeof effect.weight === "number" ? Math.max(0, effect.weight) : 0;
    return sum + weight;
  }, 0);

  if (totalWeight <= 0) {
    return effects[0];
  }

  let roll = Math.random() * totalWeight;
  for (const effect of effects) {
    const weight =
      typeof effect.weight === "number" ? Math.max(0, effect.weight) : 0;
    roll -= weight;
    if (roll <= 0) {
      return effect;
    }
  }

  return effects[effects.length - 1];
}

function runSpin(finalRotation, winningEffect) {
  isSpinning = true;
  resultDisplay.classList.add("hidden");

  const spinDuration =
    MIN_SPIN_DURATION + Math.random() * SPIN_DURATION_VARIANCE; // 3-5 seconds
  const startTime = Date.now();

  function animate() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / spinDuration, 1);

    // Easing function (ease-out)
    const easeOut = 1 - Math.pow(1 - progress, 3);
    currentRotation = easeOut * finalRotation;

    drawWheel(currentRotation);

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      showResult(winningEffect);
      isSpinning = false;
    }
  }

  animate();
}

// Spin the wheel
function spinWheel() {
  if (isSpinning || effects.length === 0) return;

  const rotations = Math.floor(
    MIN_ROTATIONS + Math.random() * ROTATION_VARIANCE,
  ); // 5-9 full rotations
  const winningEffect = pickWeightedEffect();
  const targetIndex = effects.indexOf(winningEffect);
  const finalRotation =
    rotations * 2 * Math.PI + getRotationForIndex(targetIndex);

  runSpin(finalRotation, winningEffect);
}

// Show the result
function showResult(effect) {
  effectName.textContent = effect.name;
  effectDescription.textContent = effect.description;

  // Set background color based on effect
  resultDisplay.style.background = `linear-gradient(135deg, ${effect.color}88, ${effect.color}44)`;

  if (typeof effect.goalsRequired === "number") {
    bonusStatus.textContent = `⚡ Durée: ${effect.goalsRequired} but${effect.goalsRequired === 1 ? "" : "s"}`;
    bonusStatus.classList.add("active");
  } else {
    bonusStatus.textContent = "";
    bonusStatus.classList.remove("active");
  }

  if (rarityBadge) {
    if (effect.isNoWayy) {
        rarityBadge.textContent = "No Wayyy *";
      rarityBadge.classList.remove("is-hidden");
    } else if (effect.isLegendary) {
        rarityBadge.textContent = "Légendaire *";
      rarityBadge.classList.remove("is-hidden");
    } else if (effect.isRare) {
      rarityBadge.textContent = "Rare *";
      rarityBadge.classList.remove("is-hidden");
    } else {
      rarityBadge.textContent = "Commun";
      rarityBadge.classList.remove("is-hidden");
    }
  }

  resultDisplay.classList.remove("hidden");
  resultDisplay.classList.add("effect-flash");

  if (!hasSpun) {
    hasSpun = true;
    if (wheelHint) {
      wheelHint.classList.add("hidden");
    }
  }

  // Remove flash animation after it completes
  setTimeout(() => {
    resultDisplay.classList.remove("effect-flash");
  }, 500);

  // Note: No auto-hide timer - bonus stays until goals are scored
}

function showCheatResult(effectId) {
  if (effects.length === 0) {
    return;
  }
  const forcedEffect = effects.find((effect) => effect.id === effectId);
  if (!forcedEffect) {
    return;
  }
  const targetIndex = effects.findIndex((effect) => effect.id === effectId);
  if (targetIndex === -1) {
    return;
  }

  const rotations = Math.floor(
    MIN_ROTATIONS + Math.random() * ROTATION_VARIANCE,
  ); // 5-9 full rotations
  const finalRotation =
    rotations * 2 * Math.PI + getRotationForIndex(targetIndex);

  runSpin(finalRotation, forcedEffect);
}

// Event listeners
canvas.addEventListener("click", () => {
  if (effects.length === 0) {
    showLoadError();
    return;
  }
  if (!isSpinning) {
    spinWheel();
  }
});
window.addEventListener("resize", () => {
  resizeCanvas();
  drawWheel(currentRotation);
});

// Allow Enter key to spin
document.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && !isSpinning) {
    spinWheel();
  }
});

if (cheatBlue) {
  cheatBlue.addEventListener("click", (event) => {
    event.preventDefault();
    if (!isSpinning) {
      showCheatResult(3);
    }
  });
}

if (cheatRed) {
  cheatRed.addEventListener("click", (event) => {
    event.preventDefault();
    if (!isSpinning) {
      showCheatResult(4);
    }
  });
}

function updateFullscreenToggle() {
  if (!fullscreenToggle) {
    return;
  }
  const isFullscreen = Boolean(document.fullscreenElement);
  fullscreenToggle.textContent = isFullscreen
    ? "Quitter le plein ecran"
    : "Plein ecran";
  fullscreenToggle.setAttribute(
    "aria-pressed",
    isFullscreen ? "true" : "false",
  );
}

if (fullscreenToggle) {
  fullscreenToggle.addEventListener("click", async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else if (document.documentElement.requestFullscreen) {
      await document.documentElement.requestFullscreen();
    }
  });
  updateFullscreenToggle();
}

document.addEventListener("fullscreenchange", updateFullscreenToggle);

if (rulesToggle && rulesModal) {
  const closeRules = () => {
    rulesModal.classList.add("is-hidden");
    rulesToggle.setAttribute("aria-expanded", "false");
  };

  const openRules = () => {
    rulesModal.classList.remove("is-hidden");
    rulesToggle.setAttribute("aria-expanded", "true");
  };

  rulesToggle.addEventListener("click", () => {
    if (rulesModal.classList.contains("is-hidden")) {
      openRules();
    } else {
      closeRules();
    }
  });

  rulesModal.addEventListener("click", (event) => {
    const target = event.target;
    if (target instanceof HTMLElement && target.closest("[data-rules-close]")) {
      closeRules();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !rulesModal.classList.contains("is-hidden")) {
      closeRules();
    }
  });
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch((error) => {
      console.warn("Service worker registration failed:", error);
    });
  });
}
