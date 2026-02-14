import { dom, ctx } from "./dom.js";
import { attachGlobalListeners } from "./listeners.js";
import {
  setupRulesModal,
  setupProbabilitiesModal,
} from "./modals.js";
import { loadEffects, loadRules } from "./data.js";

function init() {
  if (!dom.canvas || !ctx) {
    return;
  }
  attachGlobalListeners();
  setupRulesModal();
  setupProbabilitiesModal();
  loadEffects();
  loadRules();
}

init();
