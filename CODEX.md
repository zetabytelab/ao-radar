# How Codex helped

Work started during the 1 November 2026 build window, after checking the London clock and event schedule.

1. Inspected the existing planning pack, 12-row seed and rubric. Identified missing source dates and the risk of leaking expected grades into the model input.
2. Looked up and fetched current official Decisions documentation rather than guessing the API. Confirmed gpt-6-luna, named choice questions, confidence and refusal handling. Identified that arbitrary extraction belongs in Responses structured outputs.
3. Scaffolded Next.js/TypeScript/Tailwind, designed the terminal-inspired radar and logo mosaic, and implemented the server-side Decisions route, filters, inspector, retry and export.
4. Wrote tests for malformed/duplicate/missing answers, refusal handling, seed leakage and sample provenance.
5. Exercised the 12-company sample journey and filtering in Chrome. Fixed a production-build incompatibility between explicit runtime config and the current Next.js cache-components default.

Human contribution: product direction, seed research, rubric, prioritisation and final assessment of evidence. Seed research predates the event; app code was created during it. Codex-generated samples are labelled as illustrative, not model outputs.

Live upstream verification: all 12 local server-route requests passed with real Decisions results on 1 November 2026. Corrected the local secret filename so Next.js could load it, and configured the hosting secret without printing its value. Public source destination: zetabytelab/ao-radar. Public app hosting is complete at https://ao-radar-bice.vercel.app; all 12 production grades passed without authentication. Fixed the missing Vercel framework preset and removed the default login protection for the public submission. Video recording remains outstanding.

Evidence improvement: investigated the note-only Unknown results, reviewed 12 public source pages, added dated summaries and scope, corrected MEDVi domain, distinguished claims from verification, and removed unhelpful confidence displays for missing evidence. No model results were hard-coded as live answers.

Audience demo: reviewed three owner-supplied video references, built the original CSS logo-fish pond, local prediction/reveal interaction, QR phone entry and catch tray. Browser-tested an operations-claim reveal and a product-only surprise, plus a 390px phone layout and automatic scrolling to prediction controls. Reference footage is not bundled. Audience catches remain local to each screen.

Visual cockpit: translated the reference into a colourful screenshot wall, company teardown tabs, observed CTA labels and live four-lens confidence displays. Captured all 12 public websites, integrated Context.dev refreshes, and rejected extracted founder/social information that did not match page evidence. Discovered Alexandria tools, inspected input and pricing contracts, tested two bounded public-profile lookups and represented empty index coverage without inventing social or advertising results.

Full index expansion: imported the 34 public profiles, preserved source attribution, added 24 Context.dev captures, replaced fixed demo counts and bounded the scrollable fishing pond. Added exact-membership and screenshot checks, excluded directory grades from model input, handled two withheld company websites, and guarded the API against stale numeric IDs after reordering.

Design review: located Emil Kowalski's Apple Design skill through the author's site, inventoried its single-file folder, verified its immutable Git blob, read the complete source for security issues and documented the limits before applying it. Refreshed typography, hierarchy and visual surfaces; removed artificial feedback delay and confined scan-follow scrolling to the company wall. No third-party installer or new runtime dependency was run.
