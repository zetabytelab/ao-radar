# AO Radar / fAO

**[Open the public live demo](https://ao-radar-bice.vercel.app)** — no login required.

**fAO fishes AOs.** Explore lean agent-operated organisations, inspect what the evidence supports, and borrow an experiment for your next company.

Built during DevDay Exchange Community Hackathon, London, 1 November 2026. Core journey: **12 seeds → four Decisions assessments → searchable logo mosaic → evidence inspector → JSON export**.

## Run locally

Node.js 22 recommended.

```sh
npm ci
cp .env.example .env.local
# Add OPENAI_API_KEY to .env.local for live grading. Never commit the key.
npm run dev
```

Open http://localhost:3000. Select Sample mode for an offline walkthrough, or Live mode after configuring the key. Click **Grade all 12**, filter by agent operations or team size, then select a card. Export JSON to preserve the run; browser state otherwise resets on refresh.

```sh
npm test
npm run build
npm start
```

## What is real

Live mode calls `POST https://api.openai.com/v1/decisions` with `gpt-6-luna` from a server route. Four named choice questions assess operations, team size, buyer and economics evidence. Answers are validated; errors remain retryable and never silently become samples. The key stays server-side.

Each company now includes a public source summary, URL, capture date and assessment scope in `lib/evidence.json`. These summaries were manually reviewed during the hackathon; websites are not fetched dynamically on each grading request. The inspector and JSON export include provenance. Company statements establish **claims**, not independent verification. Andon is assessed specifically as its Market field experiment, not as the entire parent lab. MEDVi's domain was corrected to medvi.org based on its official statement.

**Product only** means the supplied source describes an AI product but does not establish internal agent operation. It is not proof that the company uses no agents. Positive operations labels are explicitly marked **Claimed**. Team size still uses an undated seed claim when no better source is supplied. Economics grades apply to financial claims, not product quality; missing economics are labelled accordingly. No unsupported audited grades or revenue-per-person rankings are displayed.

Sample mode is hand-authored, illustrative and labelled. It makes no model call. It is not a recording of live model outputs.

## Verification and limits

The original note-only run produced mostly Unknown results. After adding source summaries, the 1 November local live run returned 3 cross-function operations claims, 9 product descriptions, and 9 documented buyer classifications. Polsia's historical pitch-deck economics were classified D (claim only). All 12 requests passed. These are assessments of the supplied evidence, not independent company audits.

```sh
node scripts/check-live.mjs https://ao-radar-bice.vercel.app
```

This repeats all 12 live API requests (charges apply on a cold cache). Results go to `/tmp/ao-radar-live-check.json`. Six unit tests cover response validation and source provenance; lint and production build are also checked.

Implemented: 12-company seed journey, real Decisions calls, sourced inspector, filters, logo fallback, retry and JSON export. Directory extraction, avatars, QR submission and shared durable storage remain deferred. Arbitrary entity extraction would use Responses structured outputs rather than an invented Decisions schema.

Cache and limits (60 uncached requests/hour, 3 concurrent) are per process, not distributed production quotas. Logos use Google's favicon service; company domains are sent to that service. Initials appear on load failure. Company names and logos are not endorsements.

## Deployment and submission

Deploy as a standard Next.js Node application. Set `OPENAI_API_KEY` in the host's encrypted server environment. Without it the public sample journey remains available. Verify the deployed link in a signed-out browser and ensure deployment protection is disabled for judges. Never put a secret in `NEXT_PUBLIC_*`, screenshots, exports or the video.

Public source: [zetabytelab/ao-radar](https://github.com/zetabytelab/ao-radar). Production: [ao-radar-bice.vercel.app](https://ao-radar-bice.vercel.app), hosted in the ZetaFlow Vercel project `ao-radar`. This repository contains only the app, not the parent planning pack. `.env.example` is included; `.env.local`, `.next`, `node_modules` and `.vercel` are excluded.

Freeze features by **15:30 London**, record by **16:15**, verify public links and submit by **16:40**, leaving 20 minutes before the event's 17:00 close. All 12 live calls are checked locally and in production; repeat after evidence changes.

See [DEMO.md](DEMO.md) for a <90-second walkthrough and [CODEX.md](CODEX.md) for concrete Codex contributions.

## Credits and references

- Next.js `create-next-app` App Router + TypeScript + Tailwind scaffold; React and Next.js dependencies retain their respective licenses.
- Original AO Radar interface and CSS radar illustration created with Codex during the event. No purchased design template.
- Seed notes and rubric supplied by the project owner before the hackathon; inspired by Autopilot Index. No prior product code copied.
- Company names and logos belong to their owners; favicons supplied via Google. No affiliation implied.
- [OpenAI Decisions guide](https://developers.openai.com/api/docs/guides/decisions), verified 1 Nov 2026.
- [Decisions Cookbook](https://developers.openai.com/cookbook/examples/decisions/customer_request_routing).
- [Codex quickstart](https://developers.openai.com/codex/quickstart).
- [Next.js installation](https://nextjs.org/docs/app/getting-started/installation).
- [Event and submission schedule](https://luma.com/dde-ldn-hack).

## fAO fishing club

The opening screen is now an interactive pond: pick a company-logo fish or cast randomly, predict agent crew versus AI product, then reveal the real Decisions assessment. Successful catches populate a local tray; the source inspector remains available below. The QR opens the same seeded experience on audience phones. Predictions and catches stay on each screen; no personal information, shared room state, new-company submissions or leaderboard is collected. Refresh resets the catch tray; JSON export preserves assessments.

The three reference videos supplied by the owner were reviewed for interaction direction (progressive logo mosaics, visible progress and sorting). No footage or assets were copied. Fish, boat and water are original CSS drawings; QR rendering uses the ISC-licensed qrcode.react dependency. Motion respects the reduced-motion setting.
