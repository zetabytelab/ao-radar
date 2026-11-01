# How Codex helped

Work started during the 1 November 2026 build window, after checking the London clock and event schedule.

1. Inspected the existing planning pack, 12-row seed and rubric. Identified missing source dates and the risk of leaking expected grades into the model input.
2. Looked up and fetched current official Decisions documentation rather than guessing the API. Confirmed gpt-6-luna, named choice questions, confidence and refusal handling. Identified that arbitrary extraction belongs in Responses structured outputs.
3. Scaffolded Next.js/TypeScript/Tailwind, designed the terminal-inspired radar and logo mosaic, and implemented the server-side Decisions route, filters, inspector, retry and export.
4. Wrote tests for malformed/duplicate/missing answers, refusal handling, seed leakage and sample provenance.
5. Exercised the 12-company sample journey and filtering in Chrome. Fixed a production-build incompatibility between explicit runtime config and the current Next.js cache-components default.

Human contribution: product direction, seed research, rubric, prioritisation and final assessment of evidence. Seed research predates the event; app code was created during it. Codex-generated samples are labelled as illustrative, not model outputs.

Live upstream verification remains pending an API key. Public source destination: zetabytelab/ao-radar. Public app hosting and video recording remain submission tasks; do not claim them completed until verified.
