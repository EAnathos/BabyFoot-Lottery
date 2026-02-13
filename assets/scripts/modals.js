import { dom } from "./dom.js";
import { renderProbabilities } from "./probabilities.js";

export function setupFullscreenToggle() {
  if (!dom.fullscreenToggle) {
    return;
  }

  const updateFullscreenToggle = () => {
    const isFullscreen = Boolean(document.fullscreenElement);
    dom.fullscreenToggle.textContent = isFullscreen
      ? "Quitter le plein ecran"
      : "Plein ecran";
    dom.fullscreenToggle.setAttribute(
      "aria-pressed",
      isFullscreen ? "true" : "false",
    );
  };

  dom.fullscreenToggle.addEventListener("click", async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else if (document.documentElement.requestFullscreen) {
      await document.documentElement.requestFullscreen();
    }
  });

  document.addEventListener("fullscreenchange", updateFullscreenToggle);
  updateFullscreenToggle();
}

export function setupRulesModal() {
  if (!dom.rulesToggle || !dom.rulesModal) {
    return;
  }

  const closeRules = () => {
    dom.rulesModal.classList.add("is-hidden");
    dom.rulesToggle.setAttribute("aria-expanded", "false");
  };

  const openRules = () => {
    dom.rulesModal.classList.remove("is-hidden");
    dom.rulesToggle.setAttribute("aria-expanded", "true");
  };

  dom.rulesToggle.addEventListener("click", () => {
    if (dom.rulesModal.classList.contains("is-hidden")) {
      openRules();
    } else {
      closeRules();
    }
  });

  dom.rulesModal.addEventListener("click", (event) => {
    const target = event.target;
    if (target instanceof HTMLElement && target.closest("[data-rules-close]")) {
      closeRules();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !dom.rulesModal.classList.contains("is-hidden")) {
      closeRules();
    }
  });
}

export function setupProbabilitiesModal() {
  if (!dom.probabilitiesToggle || !dom.probabilitiesModal) {
    return;
  }

  const closeProbabilities = () => {
    dom.probabilitiesModal.classList.add("is-hidden");
    dom.probabilitiesToggle.setAttribute("aria-expanded", "false");
  };

  const openProbabilities = () => {
    dom.probabilitiesModal.classList.remove("is-hidden");
    dom.probabilitiesToggle.setAttribute("aria-expanded", "true");
  };

  dom.probabilitiesToggle.addEventListener("click", () => {
    if (dom.probabilitiesModal.classList.contains("is-hidden")) {
      renderProbabilities();
      openProbabilities();
    } else {
      closeProbabilities();
    }
  });

  if (dom.probabilitiesFilter) {
    dom.probabilitiesFilter.addEventListener("change", () => {
      renderProbabilities();
    });
  }

  dom.probabilitiesModal.addEventListener("click", (event) => {
    const target = event.target;
    if (
      target instanceof HTMLElement &&
      target.closest("[data-probabilities-close]")
    ) {
      closeProbabilities();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      !dom.probabilitiesModal.classList.contains("is-hidden")
    ) {
      closeProbabilities();
    }
  });
}
