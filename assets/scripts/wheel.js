import { dom, ctx } from "./dom.js";
import { state } from "./state.js";
import {
  MIN_SPIN_DURATION,
  SPIN_DURATION_VARIANCE,
  MIN_ROTATIONS,
  ROTATION_VARIANCE,
} from "./constants.js";
import {
  getWeightMeta,
  getRotationForIndex,
  pickWeightedEffect,
} from "./weights.js";
import { showResult } from "./result.js";

export function resizeCanvas() {
  const maxSize = Math.min(window.innerWidth * 0.78, 520);
  const size = Math.max(240, Math.floor(maxSize));
  dom.canvas.width = size;
  dom.canvas.height = size;
  state.wheelRadius = Math.max(120, Math.floor(size / 2 - 18));
  state.centerCircleRadius = Math.max(18, Math.floor(size * 0.06));
}

export function drawWheel(rotation = 0) {
  const centerX = dom.canvas.width / 2;
  const centerY = dom.canvas.height / 2;
  const numSegments = state.effects.length;
  const { weights, totalWeight, anglePerWeight } = getWeightMeta();

  ctx.clearRect(0, 0, dom.canvas.width, dom.canvas.height);

  if (numSegments === 0 || totalWeight <= 0) {
    return;
  }

  // Draw segments
  let cumulativeAngle = 0;
  state.effects.forEach((effect, index) => {
    const segmentWeight = weights[index];
    const segmentAngle = segmentWeight * anglePerWeight;
    const startAngle = rotation + cumulativeAngle;
    const endAngle = rotation + cumulativeAngle + segmentAngle;

    // Draw segment
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, state.wheelRadius, startAngle, endAngle);
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
    const fontSize = Math.max(12, Math.floor(state.wheelRadius * 0.085));
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.shadowBlur = 3;
    ctx.fillText(effect.name, state.wheelRadius * 0.65, 5);
    ctx.restore();

    cumulativeAngle += segmentAngle;
  });

  // Draw center circle
  ctx.beginPath();
  ctx.arc(centerX, centerY, state.centerCircleRadius, 0, 2 * Math.PI);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.strokeStyle = "#333";
  ctx.lineWidth = 3;
  ctx.stroke();
}

export function updateSpinButton() {
  // No button anymore; keep API for enabling/disabling spin via click.
}

export function runSpin(finalRotation, winningEffect) {
  state.isSpinning = true;
  dom.resultDisplay.classList.add("hidden");

  const spinDuration =
    MIN_SPIN_DURATION + Math.random() * SPIN_DURATION_VARIANCE; // 3-5 seconds
  const startTime = Date.now();

  function animate() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / spinDuration, 1);

    // Easing function (ease-out)
    const easeOut = 1 - Math.pow(1 - progress, 3);
    state.currentRotation = easeOut * finalRotation;

    drawWheel(state.currentRotation);

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      showResult(winningEffect);
      state.isSpinning = false;
    }
  }

  animate();
}

export function spinWheel() {
  if (state.isSpinning || state.effects.length === 0) {
    return;
  }

  const rotations = Math.floor(
    MIN_ROTATIONS + Math.random() * ROTATION_VARIANCE,
  ); // 5-9 full rotations
  const winningEffect = pickWeightedEffect();
  const targetIndex = state.effects.indexOf(winningEffect);
  const finalRotation =
    rotations * 2 * Math.PI + getRotationForIndex(targetIndex);

  runSpin(finalRotation, winningEffect);
}

export function showCheatResult(effectId) {
  if (state.effects.length === 0) {
    return;
  }
  const forcedEffect = state.effects.find((effect) => effect.id === effectId);
  if (!forcedEffect) {
    return;
  }
  const targetIndex = state.effects.findIndex(
    (effect) => effect.id === effectId,
  );
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
