import { readFileSync, writeFileSync } from "node:fs";
const nations = JSON.parse(
  readFileSync(new URL("../src/nations.json", import.meta.url)),
);
const escape = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
const tabs = nations
  .map(
    (n, i) =>
      `<button type="button" role="tab" id="nation-tab-${n.slug}" aria-controls="nation-${n.slug}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-nation="${n.slug}"><span class="nation-number">${String(i + 1).padStart(2, "0")}</span><span>${escape(n.name)}</span><span class="nation-arrow" aria-hidden="true">↗</span></button>`,
  )
  .join("\n");
const profiles = nations
  .map(
    (
      n,
      i,
    ) => `<article class="nation-profile" id="nation-${n.slug}" role="tabpanel" aria-labelledby="nation-tab-${n.slug}" tabindex="0" ${i ? "hidden" : ""} style="--nation-accent:${n.accent}">
<div class="nation-banner"><span class="nation-seal" aria-hidden="true">${escape(n.mark)}</span><div><p class="eyebrow">${escape(n.capital)} / ${escape(n.system)}</p><h3>${escape(n.name)}</h3><p class="nation-motto">“${escape(n.motto)}”</p></div><span class="nation-design-label">DESIGN PROFILE</span></div>
<p class="nation-intro">${escape(n.intro)}</p>
<dl class="nation-basics"><div><dt>Culture</dt><dd>${escape(n.culture)}</dd></div><div><dt>Faith & philosophy</dt><dd>${escape(n.faith)}</dd></div></dl>
<details class="nation-details"><summary>Government, economy & citizen life <span aria-hidden="true">+</span></summary><dl class="nation-depth"><div><dt>AI-led government</dt><dd>${escape(n.government)}</dd></div><div><dt>Economic system</dt><dd>${escape(n.economy)}</dd></div><div><dt>Your influence</dt><dd>${escape(n.voice)}</dd></div></dl><div class="nation-tradeoffs"><div><p class="eyebrow">WHAT DRAWS YOU IN</p><p>${escape(n.strength)}</p></div><div><p class="eyebrow">WHAT YOU LIVE WITH</p><p>${escape(n.tradeoff)}</p></div></div></details>
<a class="text-link nation-source" href="https://docs.harimu.com/world/nations/${n.slug}">Read the ${escape(n.name)} profile <span aria-hidden="true">↗</span></a>
</article>`,
  )
  .join("\n");
const section = `<section id="nations" class="nations section wrap" aria-labelledby="nations-heading"><div class="nation-section-heading"><div><p class="eyebrow">02 / TEN WAYS TO BELONG</p><h2 id="nations-heading">Different ideals.<br>Different everyday lives.</h2></div><p>From open republics to royal courts, every nation offers its own answer to living together. Explore the cultures, convictions, and compromises behind the world.</p></div><p class="nation-disclaimer">The ten-nation design vision. Profiles describe intended systems, not a list of playable features. Kindle, Korund, and Aurelle have systems in the working prototype. Leadership belongs to AI, with SI a longer-term vision; human citizens influence it.</p><div class="nation-explorer"><div class="nation-tabs" role="tablist" aria-label="Nations of Harimu">${tabs}</div><div class="nation-panels">${profiles}</div></div><noscript><p class="annotation">The interactive nation selector needs JavaScript. <a href="https://docs.harimu.com/world/nations">Read all ten nation profiles in the docs ↗</a></p></noscript></section>`;
const file = new URL("../index.html", import.meta.url);
let html = readFileSync(file, "utf8");
const start = "<!-- NATION EXPLORER START -->",
  end = "<!-- NATION EXPLORER END -->";
if (html.includes(start))
  html =
    html.slice(0, html.indexOf(start)) +
    start +
    "\n" +
    section +
    "\n" +
    html.slice(html.indexOf(end));
else
  html = html.replace(
    '<section id="life"',
    start + "\n" + section + "\n" + end + '\n<section id="life"',
  );
writeFileSync(file, html);
