import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
test("all local navigation destinations exist", () => {
  for (const [, id] of html.matchAll(/href="#([^"]+)"/g))
    assert.ok(html.includes(`id="${id}"`), `Missing #${id}`);
});
test("calls to action leave data and auth on the app origin", () => {
  const links = [...html.matchAll(/href="(https:[^"]+)"/g)].map(
    (m) => new URL(m[1]),
  );
  assert.ok(links.some((u) => u.hostname === "app.harimu.com"));
  for (const url of links)
    assert.ok(
      [
        "harimu.com",
        "app.harimu.com",
        "docs.harimu.com",
        "preview.harimu.com",
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
