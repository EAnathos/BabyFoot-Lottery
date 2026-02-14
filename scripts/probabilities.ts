import { dom } from "./dom.js";
import { state } from "./state.js";
import { getWeightMeta } from "./weights.js";
import { getRarityLabel, getRarityDisplay } from "./rarity.js";

export function showProbabilitiesLoadError() {
  if (!dom.probabilitiesList) {
    return;
  }
  dom.probabilitiesList.innerHTML = "";
  const listItem = document.createElement("li");
  listItem.textContent = "Impossible de charger les probabilites.";
  dom.probabilitiesList.appendChild(listItem);
}

export function renderProbabilities() {
  if (!dom.probabilitiesList) {
    return;
  }
  const { weights, totalWeight } = getWeightMeta();
  if (totalWeight <= 0) {
    showProbabilitiesLoadError();
    return;
  }

  const activeFilter = dom.probabilitiesFilter?.value || "all";
  const sortedEffects = state.effects
    .map((effect, index) => ({ effect, index }))
    .sort((a, b) => {
      const weightDiff = (weights[b.index] || 0) - (weights[a.index] || 0);
      if (weightDiff !== 0) {
        return weightDiff;
      }
      return a.effect.name.localeCompare(b.effect.name, "fr");
    })
    .filter(({ effect }) =>
      activeFilter === "all" ? true : getRarityLabel(effect) === activeFilter,
    );

  dom.probabilitiesList.classList.add("probabilities-list");
  dom.probabilitiesList.innerHTML = "";

  if (dom.probabilitiesCount) {
    const countLabel = sortedEffects.length === 1 ? "effet" : "effets";
    dom.probabilitiesCount.textContent =
      `${sortedEffects.length} ${countLabel}`;
  }

  if (sortedEffects.length === 0) {
    const listItem = document.createElement("li");
    listItem.textContent = "Aucun effet pour ce filtre.";
    dom.probabilitiesList.appendChild(listItem);
    return;
  }

  sortedEffects.forEach(({ effect, index }) => {
    const weight = weights[index] || 0;
    const probability = (weight / totalWeight) * 100;

    const listItem = document.createElement("li");
    listItem.className = "probability-item";

    const row = document.createElement("div");
    row.className = "probability-row";

    const name = document.createElement("span");
    name.className = "probability-name";
    name.textContent = effect.name;

    const value = document.createElement("span");
    value.className = "probability-value";
    value.textContent = `${probability.toFixed(1)}%`;

    const badge = document.createElement("span");
    badge.className = "probability-badge";
    badge.textContent = getRarityDisplay(effect);

    const meta = document.createElement("div");
    meta.className = "probability-meta";
    meta.appendChild(value);
    meta.appendChild(badge);

    row.appendChild(name);
    row.appendChild(meta);

    const description = document.createElement("div");
    description.className = "probability-description";
    description.textContent = effect.description || "";

    listItem.appendChild(row);
    if (description.textContent) {
      listItem.appendChild(description);
    }
    dom.probabilitiesList.appendChild(listItem);
  });
}
