import { dom } from "./dom.js";
import { state } from "./state.js";
import { showLoadError } from "./result.js";
import { spinWheel, showCheatResult, resizeCanvas, drawWheel } from "./wheel.js";

export function attachGlobalListeners() {
  dom.canvas.addEventListener("click", () => {
    if (state.effects.length === 0) {
      showLoadError();
      return;
    }
    if (!state.isSpinning) {
      spinWheel();
    }
  });

  window.addEventListener("resize", () => {
    resizeCanvas();
    drawWheel(state.currentRotation);
  });

  document.addEventListener("keypress", (event) => {
    if (event.key === "Enter" && !state.isSpinning) {
      spinWheel();
    }
  });

  if (dom.cheatBlue) {
    dom.cheatBlue.addEventListener("click", (event) => {
      event.preventDefault();
      if (!state.isSpinning) {
        showCheatResult(3);
      }
    });
  }

  if (dom.cheatRed) {
    dom.cheatRed.addEventListener("click", (event) => {
      event.preventDefault();
      if (!state.isSpinning) {
        showCheatResult(4);
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
}
