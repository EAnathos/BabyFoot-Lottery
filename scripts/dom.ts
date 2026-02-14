export const dom = {
  canvas: document.getElementById("wheelCanvas") as HTMLCanvasElement | null,
  resultDisplay: document.getElementById("resultDisplay") as HTMLDivElement | null,
  effectName: document.getElementById("effectName") as HTMLHeadingElement | null,
  effectDescription: document.getElementById("effectDescription") as HTMLParagraphElement | null,
  bonusStatus: document.getElementById("bonusStatus") as HTMLDivElement | null,
  stunCountdownButton: document.getElementById("stunCountdownButton") as HTMLButtonElement | null,
  rarityBadge: document.getElementById("rarityBadge") as HTMLSpanElement | null,
  wheelHint: document.querySelector(".wheel-hint") as HTMLParagraphElement | null,
  cheatBlue: document.getElementById("cheatBlue") as HTMLSpanElement | null,
  cheatRed: document.getElementById("cheatRed") as HTMLSpanElement | null,
  rulesToggle: document.getElementById("rulesToggle") as HTMLButtonElement | null,
  rulesModal: document.getElementById("rulesModal") as HTMLDivElement | null,
  rulesList: document.getElementById("rulesList") as HTMLUListElement | null,
  probabilitiesToggle: document.getElementById("probabilitiesToggle") as HTMLButtonElement | null,
  probabilitiesModal: document.getElementById("probabilitiesModal") as HTMLDivElement | null,
  probabilitiesList: document.getElementById("probabilitiesList") as HTMLUListElement | null,
  probabilitiesFilter: document.getElementById("probabilitiesFilter") as HTMLSelectElement | null,
  probabilitiesCount: document.getElementById("probabilitiesCount") as HTMLSpanElement | null,
};

export const ctx = dom.canvas?.getContext("2d") ?? null;
