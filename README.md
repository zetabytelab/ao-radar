# AO Radar / fAO

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

Live mode calls `POST https://api.openai.com/v1/decisions` with `gpt-6-luna` from a server route. Four named `choice` questions classify agent operations, team size, buyer and evidence. Responses are validated by question name, allowed choices and confidence range. Refusals become Unknown; errors remain visible and retryable. The API key never enters browser code. Requests are restricted to the 12 seed IDs.

Sample mode uses explicit hand-authored fixtures, makes no model call, and is labelled in the UI and exports. It is not a recorded API response. A live request never silently falls back to samples.

Seed notes were supplied before the event. They are unverified, undated discovery leads. We exclude legacy grades, section labels and revenue fields from model input; seed notes may still mention economic claims, visibly labelled unverified. A URL alone is not evidence: this release does not retrieve websites. Evidence grades should therefore remain Unknown until underlying source material is available. Model confidence is not factual verification. Autonomy assessments remain provisional and require human review.

No revenue-per-person ranking: the seed lacks comparable dated financial/headcount sources. ARR figures in the original research are not displayed. No founder contact details or avatars are collected.

## Scope and limits

- Implemented: seeded journey, server-side Decisions integration, sample walkthrough, search/filters, logo fallback, inspector, retry and JSON export.
- Deferred: directory extraction, founder avatars, QR submission and durable shared storage.
- Decisions supports predicates, choices and scores. Arbitrary entity extraction would use Responses structured outputs, not an invented Decisions schema.
- Cache and request limits (60 uncached requests/hour, 3 concurrent) are per server process. They are demo safeguards, not a distributed production quota. Configure a dedicated project budget before broad public live use.
- Logos load through Google's favicon service; company domains are sent to that service. Initials appear if an image fails. Third-party links can change and need a final public-access check before submission.

## Deployment and submission

Deploy as a standard Next.js Node application. Set `OPENAI_API_KEY` in the host's encrypted server environment. Without it the public sample journey remains available. Verify the deployed link in a signed-out browser and ensure deployment protection is disabled for judges. Never put a secret in `NEXT_PUBLIC_*`, screenshots, exports or the video.

Public source: [zetabytelab/ao-radar](https://github.com/zetabytelab/ao-radar). Hosting has not yet been configured. This repository contains only the app, not the parent planning pack. `.env.example` is included; `.env.local`, `.next`, `node_modules` and `.vercel` are excluded.

Freeze features by **15:30 London**, record by **16:15**, verify public links and submit by **16:40**, leaving 20 minutes before the event's 17:00 close. Live API access is the first dependency to resolve. Do not add extraction or QR until all 12 live calls work.

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
