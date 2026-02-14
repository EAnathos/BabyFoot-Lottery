import { dom } from "./dom.js";

export function renderRules(rules) {
  if (!dom.rulesList) {
    return;
  }
  dom.rulesList.innerHTML = "";
  rules.forEach((rule) => {
    const listItem = document.createElement("li");
    listItem.textContent = String(rule);
    dom.rulesList.appendChild(listItem);
  });
}

export function showRulesLoadError() {
  if (!dom.rulesList) {
    return;
  }
  dom.rulesList.innerHTML = "";
  const listItem = document.createElement("li");
  listItem.textContent = "Impossible de charger rules.json.";
  dom.rulesList.appendChild(listItem);
}
