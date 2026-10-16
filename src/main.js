const scales = {
  world: [
    "History belongs to everyone.",
    "Ten nations are envisioned on one planet, connected through diplomacy, trade, science, culture, and conflict. Your story unfolds inside that larger history.",
  ],
  nation: [
    "Different ideals. Shared consequences.",
    "AI-led nations have distinct cultures and political systems. Kindle, Korund, and Aurelle systems feature in the working prototype; the full ten-nation world is the vision.",
  ],
  city: [
    "A society at street level.",
    "Markets and city squares bring the prototype’s civic life closer. The wider vision includes cities shaped by the people who call them home.",
  ],
  home: [
    "The world becomes personal.",
    "Households and family are part of Harimu’s design vision: a home, relationships, and everyday choices that give the larger world a human scale.",
  ],
};
const tabs = [...document.querySelectorAll("[data-scale]")];
function selectTab(tab) {
  for (const item of tabs) {
    item.setAttribute("aria-selected", String(item === tab));
    item.tabIndex = item === tab ? 0 : -1;
  }
  const panel = document.querySelector("#scale-panel");
  panel.setAttribute("aria-labelledby", tab.id);
  panel.querySelector("h3").textContent = scales[tab.dataset.scale][0];
  panel.querySelector("p").textContent = scales[tab.dataset.scale][1];
}
for (const tab of tabs) {
  tab.addEventListener("click", () => selectTab(tab));
  tab.addEventListener("keydown", (event) => {
    let index = tabs.indexOf(tab);
    if (event.key === "ArrowRight") index = (index + 1) % tabs.length;
    else if (event.key === "ArrowLeft")
      index = (index + tabs.length - 1) % tabs.length;
    else if (event.key === "Home") index = 0;
    else if (event.key === "End") index = tabs.length - 1;
    else return;
    event.preventDefault();
    selectTab(tabs[index]);
    tabs[index].focus();
  });
}
// The static globe remains available with no JavaScript, WebGL, or motion.
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
const connection = navigator.connection;
if (!reducedMotion.matches && !connection?.saveData) {
  const load = () =>
    import("./planet.js")
      .then((module) => module.mountPlanet())
      .catch(() => {});
  if ("requestIdleCallback" in window)
    requestIdleCallback(load, { timeout: 1800 });
  else setTimeout(load, 250);
}

const nationTabs = [...document.querySelectorAll("[data-nation]")];
function selectNation(tab) {
  for (const item of nationTabs) {
    const active = item === tab;
    item.setAttribute("aria-selected", String(active));
    item.tabIndex = active ? 0 : -1;
    document.getElementById(item.getAttribute("aria-controls")).hidden =
      !active;
  }
}
for (const tab of nationTabs) {
  tab.addEventListener("click", () => selectNation(tab));
  tab.addEventListener("keydown", (event) => {
    let index = nationTabs.indexOf(tab);
    if (["ArrowRight", "ArrowDown"].includes(event.key))
      index = (index + 1) % nationTabs.length;
    else if (["ArrowLeft", "ArrowUp"].includes(event.key))
      index = (index + nationTabs.length - 1) % nationTabs.length;
    else if (event.key === "Home") index = 0;
    else if (event.key === "End") index = nationTabs.length - 1;
    else return;
    event.preventDefault();
    selectNation(nationTabs[index]);
    nationTabs[index].focus();
  });
}
const nationNavigation = document.querySelector('.nation-tabs');
const compactNations = matchMedia('(max-width: 680px)');
function updateNationOrientation() {
  nationNavigation.setAttribute('aria-orientation', compactNations.matches ? 'horizontal' : 'vertical');
}
updateNationOrientation();
compactNations.addEventListener('change', updateNationOrientation);
