import { dom, ctx } from "./dom.js";
import { attachGlobalListeners } from "./listeners.js";
import {
  setupFullscreenToggle,
  setupRulesModal,
  setupProbabilitiesModal,
} from "./modals.js";
import { loadEffects, loadRules } from "./data.js";

function init() {
  if (!dom.canvas || !ctx) {
    return;
  }
  attachGlobalListeners();
  setupFullscreenToggle();
  setupRulesModal();
  setupProbabilitiesModal();
  loadEffects();
  loadRules();
}

init();
