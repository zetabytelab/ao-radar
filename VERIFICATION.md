# Live verification — 1 November 2026

Public demo: https://ao-radar-bice.vercel.app

- Local: 12/12 live Decisions requests passed.
- Production: 12/12 returned HTTP 200 and validated live grades; no cookies, authentication or bypass token.
- Production API test duration: 5.97 seconds.
- Five unit tests, lint and production build passed.
- Browser: public page opened and Grade all 12 exercised in Live mode.
- API key absent from browser build; .env.local excluded from Git and deployment source. Production uses a Vercel Secret.

Most autonomy and buyer results, and all evidence grades, are Unknown because the seed notes lack supporting detail. These are valid model decisions, not failed requests. No stronger assessment was fabricated.

Deployed application commit: 9758878. Subsequent changes only update submission documentation.
