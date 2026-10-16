import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
test("all local navigation destinations exist", () => {
  for (const [, id] of html.matchAll(/href="#([^"]+)"/g))
    assert.ok(html.includes(`id="${id}"`), `Missing #${id}`);
});
test("calls to action open the working prototype without local auth", () => {
  const links = [...html.matchAll(/href="(https:[^"]+)"/g)].map(
    (m) => new URL(m[1]),
  );
  assert.ok(links.some((u) => u.hostname === "preview.harimu.com"));
  assert.ok(!html.includes("app.harimu.com"));
  const primaryLinks = [...html.matchAll(/class="button[^"]*" href="([^"]+)"/g)];
  assert.equal(primaryLinks.length, 3);
  for (const link of primaryLinks) assert.equal(link[1], "https://preview.harimu.com");
  assert.ok(!html.includes("App access is being configured"));
  for (const url of links)
    assert.ok(
      [
        "harimu.com",
        "docs.harimu.com",
        "preview.harimu.com",
        "github.com",
      ].includes(url.hostname),
    );
  assert.ok(!/<form\b/i.test(html));
});
test("existing Sites project is retained with static-only source", () => {
  const hosting = JSON.parse(
    readFileSync(new URL("../.openai/hosting.json", import.meta.url)),
  );
  assert.equal(hosting.project_id, "appgprj_6acc915e6d28819195fb8b517441739e");
  assert.equal(hosting.static.directory, "dist");
});
test("production bundle excludes credentials and server integrations", () => {
  const dist = new URL("../dist/", import.meta.url);
  function scan(dir) {
    for (const item of readdirSync(dir, { withFileTypes: true })) {
      const file = new URL(item.name + (item.isDirectory() ? "/" : ""), dir);
      if (item.isDirectory()) scan(file);
      else if (/\.(html|js|css)$/.test(item.name)) {
        const source = readFileSync(file, "utf8");
        assert.ok(
          !/sk-(?:proj-)?[A-Za-z0-9_-]{24,}|-----BEGIN (?:RSA |OPENSSH )?PRIVATE KEY-----|postgres(?:ql)?:\/\//.test(
            source,
          ),
          item.name,
        );
      }
    }
  }
  scan(dist);
});

test("all ten source-backed nation profiles have unique navigation and complete context", () => {
  const nations = JSON.parse(
    readFileSync(new URL("../src/nations.json", import.meta.url)),
  );
  assert.equal(nations.length, 10);
  assert.equal(new Set(nations.map((n) => n.slug)).size, 10);
  for (const nation of nations) {
    for (const key of [
      "culture",
      "faith",
      "government",
      "economy",
      "voice",
      "strength",
      "tradeoff",
    ])
      assert.ok(nation[key]?.length > 25, `${nation.name}: ${key}`);
    assert.ok(html.includes(`id="nation-tab-${nation.slug}"`));
    assert.ok(html.includes(`id="nation-${nation.slug}"`));
    assert.ok(
      html.includes(`https://docs.harimu.com/world/nations/${nation.slug}`),
    );
  }
});
test("Fulmara separates shareholder resolutions from human election ballots", () => {
  const nations = JSON.parse(
    readFileSync(new URL("../src/nations.json", import.meta.url)),
  );
  const fulmara = nations.find((n) => n.slug === "fulmara");
  assert.match(fulmara.government, /non-election shareholder resolutions/);
  assert.match(fulmara.voice, /one eligible verified human, one vote/);
  assert.match(fulmara.voice, /Shares add no election ballots/);
});
