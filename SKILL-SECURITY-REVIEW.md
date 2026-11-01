# Apple Design skill — source review

Reviewed 1 November 2026 before applying this skill to AO Radar.

- Author/source: [Emil Kowalski's own skill page](https://emilkowal.ski/skill) links to [`emilkowalski/skills`, `skills/apple-design`](https://github.com/emilkowalski/skills/tree/main/skills/apple-design).
- Scope: the selected folder contained **one file, `SKILL.md` (23,036 bytes)**. No bundled executables, scripts, hooks, package manifests or dependency lockfiles.
- Immutable Git blob reviewed: `adf68c517f2d7d2781587d619de07f4de286da57`. Git blob hash verified after decoding the GitHub API response.
- SHA-256: `77bb63b7043bb93aca2ff4ab040c249484eef35682bb6ff7163433c31d30adc7`.
- Manual review of the full document found design guidance and illustrative CSS/JavaScript. No credential/environment reads, data upload instructions, shell execution requirements, permission changes, destructive commands or obfuscated payloads were found.
- Examples reference Motion/Framer Motion, browser Pointer Events and animation APIs. They were inspected as text; **no installer or example code was executed and no new runtime package was installed**.
- The generic “initial response” rule applies only without a specific question. The user's concrete redesign request remains the task.

Applied guidance: native typography and optical sizing, tracking by text size, immediate press feedback, touch targets, no artificial reveal delay, local rather than page-wide scan scrolling, reduced motion/transparency and stronger-contrast preferences. Existing API concurrency controls protect live requests; they are not animation delays.

This is a static review of the pinned skill document, not an audit of its entire repository, the author's account, third-party animation libraries, or future revisions. No global skill installation was needed. The application ships our implementation, not downloaded skill code.
