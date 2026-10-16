# Harimu web

The standalone public introduction to Harimu. This repository contains only the landing page; gameplay, accounts, and data stay in the separate app.

## Develop

Requires Node 22.13+ and npm.

```sh
npm ci
npm run dev
npm run build
npm test
npm run preview
```

The Vite production build is static and outputs `dist/`. No environment variables, API keys, auth, database queries, or external runtime services are needed. Fonts currently load from Google Fonts with system fallbacks; Earth imagery and application scripts are served locally. Three.js is a deferred chunk (about 133 KB gzip), loaded only when reduced motion and data saving are off. Animation pauses offscreen/in background tabs; pixel ratio is capped at 1.5. The CSS Earth fallback works without JavaScript or WebGL.

## Site identity and publication

Existing public Sites project: `appgprj_6acc915e6d28819195fb8b517441739e`, title **Harimu**, slug `harimu-world`. As inspected 2026-10-16, its latest version is **22**, and `harimu.com` plus `www.harimu.com` are active on its Sites worker. Preserve this identity; do not register a duplicate Site.

The prior Sites source is a separate Cloudflare Artifact Git repository (retrieved commit `c6729c4b23094f79e995c1d3a287f4a8240627d1`). The game checkout at `/Users/thachp/repos/harimu/site` has GitHub remote `thachp/harimu` and is not the canonical current Sites source. This dedicated landing-page source has destination `thachp/harimu-web`.

`.openai/hosting.json` selects static `dist/` and declares D1/R2 as null because static hosting does not accept runtime bindings. No database is deleted or migrated. There is no deploy-on-push workflow. Merging a PR does **not** publish it to Sites automatically. After review, the coordinating owner must deliberately synchronize/package this source for the existing Site and save/deploy a version with the Sites tools. Review the static-vs-existing-Worker transition before publication; do not run database migrations or copy game secrets.

No DNS, app, sandbox, docs, auth, or database changes are part of this repository. Do not merge or publish without the owner's requested review.

## Content evidence

Verified against live `https://docs.harimu.com` on 2026-10-16: GDD v0.18, last updated October 15; status **Design + working prototype**. It lists core citizen loop, Kindle/Korund/Aurelle systems, markets, elections, petitions, and city squares in the prototype; realtime and many broader systems remain planned. All ten nations, the household vision, and the broader shared-world story are described as design vision. The globe is illustrative Earth imagery, not Harimu geography or live telemetry.

- https://docs.harimu.com
- https://docs.harimu.com/politics/ai-leadership
- https://docs.harimu.com/tech/architecture

`https://app.harimu.com` is the requested primary destination. Local DNS could not resolve that hostname during verification; verify reachability before publication. `preview.harimu.com` is labeled development only.

## Assets

Earth day and night textures are vendored from the Three.js example texture collection:

- https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg
- https://threejs.org/examples/textures/planets/earth_lights_2048.png

The Three.js project is MIT licensed: https://github.com/mrdoob/three.js/blob/dev/LICENSE. The imagery represents Earth and is used for an illustrative Earth-like globe. No claim of a geographically accurate Harimu map is made.
