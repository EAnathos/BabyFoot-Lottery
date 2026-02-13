export const dom = {
  canvas: document.getElementById("wheelCanvas"),
  resultDisplay: document.getElementById("resultDisplay"),
  effectName: document.getElementById("effectName"),
  effectDescription: document.getElementById("effectDescription"),
  bonusStatus: document.getElementById("bonusStatus"),
  rarityBadge: document.getElementById("rarityBadge"),
  wheelHint: document.querySelector(".wheel-hint"),
  cheatBlue: document.getElementById("cheatBlue"),
  cheatRed: document.getElementById("cheatRed"),
  fullscreenToggle: document.getElementById("fullscreenToggle"),
  rulesToggle: document.getElementById("rulesToggle"),
  rulesModal: document.getElementById("rulesModal"),
  rulesList: document.getElementById("rulesList"),
  probabilitiesToggle: document.getElementById("probabilitiesToggle"),
  probabilitiesModal: document.getElementById("probabilitiesModal"),
  probabilitiesList: document.getElementById("probabilitiesList"),
  probabilitiesFilter: document.getElementById("probabilitiesFilter"),
  probabilitiesCount: document.getElementById("probabilitiesCount"),
};

export const ctx = dom.canvas?.getContext("2d");
