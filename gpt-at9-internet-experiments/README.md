# AT9 Internet Experiments

AT9 Internet Experiments is a single-repository, browser-native laboratory for interactive work about systems, networks, scale, and computing history. It is not a résumé, SaaS landing page, news site, prompt collection, or generic game gallery.

## Experiments

1. **Stack Craft** — deterministic composition of infrastructure concepts from Linux and disks to an AI data center.
2. **Quorum** — simplified educational state machine for nodes, witness votes, Virtual IP ownership, fencing, partitions, and split-brain risk.
3. **Internet Garden** — local world map, illustrative latency estimates, protocol stages, and Navigation Timing measured in the current browser.
4. **One Million Blocks** — 1000 × 1000 local storage-array simulation using Canvas, TypedArray, Web Worker, IndexedDB, replication, and virtual disk failures.
5. **Latency** — nanosecond-to-human-time scale with logarithmic, linear, and narrative views.
6. **Data Scale** — byte-to-exabyte exploration with SI/IEC conversion and configurable assumptions.
7. **Internet Archaeology** — original, era-inspired interactive reconstructions from Telnet through agents.

## Technology

- React 19.2
- TypeScript strict mode
- Vite 8
- React Router 7 with route-level lazy loading
- pnpm
- ESLint + Prettier
- Vitest + React Testing Library
- Playwright
- Browser APIs: Canvas 2D, SVG, Web Worker, IndexedDB, localStorage, Web Audio, Navigation Timing, Performance API, Pointer Events, ResizeObserver, requestAnimationFrame

No backend, database server, account system, LLM API, API key, remote image hotlink, analytics SDK, or runtime font download is required.

## Local development

```bash
pnpm install
pnpm dev
```

Open the URL printed by Vite.

## Quality checks

```bash
pnpm lint
pnpm test
pnpm build
pnpm exec playwright install chromium # only when the browser is not already installed
pnpm exec playwright test
```

The build script creates both `dist/index.html` and `dist/404.html`.

## Production build

```bash
pnpm build
```

Output: `dist/`

## EdgeOne Makers deployment

Use these settings:

```text
Install command: pnpm install --frozen-lockfile
Build command: pnpm build
Output directory: dist
Node version: current supported LTS
```

### SPA fallback

The application uses `BrowserRouter` and clean paths. Configure EdgeOne so unknown **non-static-file** paths rewrite to `/index.html`. Keep real assets, `robots.txt`, `sitemap.xml`, `manifest.webmanifest`, and `favicon.svg` served normally.

The generated `404.html` is a static-hosting fallback, but a platform rewrite remains the preferred way to make direct requests and refreshes on deep routes work.

## Static asset strategy

- All interface graphics are CSS, SVG, or Canvas generated locally.
- The simplified world map and city dataset are bundled in the source tree.
- There are no remote images or runtime font requests.
- Each experiment is lazy loaded at the route boundary.
- The homepage uses lightweight previews and does not import the full experiment engines.

## Data truthfulness

### Measured in the browser

Internet Garden reads the current document's `PerformanceNavigationTiming` entry. These values describe only the current page load and may be zero or unavailable because of caching, connection reuse, browser privacy behavior, or local serving.

### Illustrative estimates

Internet Garden's city-to-city RTT and stage values are explicitly labeled `ILLUSTRATIVE ESTIMATE`. They are calculated from great-circle distance, a fiber propagation assumption, route stretch, and fixed protocol overhead. They are not global probes, carrier measurements, ASN data, or real-time congestion data.

Latency values are stored in `src/experiments/latency/latencyData.ts` and marked as typical, range, or illustrative. Hardware, topology, software, and workload change real values.

Data Scale analogies expose every configurable assumption. UTF-8 text is not treated as universally one byte per character.

## Optional IP information

Set `VITE_IP_API_URL` only to a CORS-enabled endpoint you control. The site contacts no IP endpoint by default and displays `UNAVAILABLE` when none is configured.

## Why One Million Blocks is local

The first version stores only the browser's local simulation. IndexedDB persists the block array; a Worker computes used, hot, lost, fragmentation, and safety metrics from the actual local state. It does not claim global sharing or multiple users.

### Future multi-user version

A later version could add an Edge Function and KV-backed append log:

1. authenticate write requests or apply anonymous rate limits;
2. store compact block mutations rather than full snapshots;
3. assign monotonic sequence numbers;
4. broadcast changes over a realtime channel;
5. periodically compact the log into versioned snapshots;
6. preserve a local/offline mode as a fallback.

That backend is intentionally not implemented in this repository.

## Add an eighth experiment

1. Create `src/experiments/<slug>/` with page, logic, data, styles, and tests.
2. Add a lazy import and route in `src/app/routes.tsx`.
3. Add its lightweight homepage metadata/preview in `src/data/experiments.tsx`.
4. Add metadata, sitemap entry, unit/component tests, and Playwright route coverage.
5. Confirm the experiment cleans up Workers, timers, observers, listeners, and animation frames.

## External links

Edit all external URLs in:

```text
src/app/siteConfig.ts
```

The published source is available under `gpt-at9-internet-experiments/` in the `htazq/www` repository.
