import { companies, parseGrade, requestBody } from '@/lib/radar';
import { connection } from 'next/server';
export const maxDuration = 60;
const cache = new Map<string, { grade: ReturnType<typeof parseGrade>; until: number }>();
let inFlight = 0;
let calls = 0;
let resetAt = Date.now() + 3600000;
export async function GET() { await connection(); return Response.json({ liveAvailable: Boolean(process.env.OPENAI_API_KEY), model: 'gpt-6-luna' }); }
export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  if (origin && new URL(origin).host !== request.headers.get('host')) return Response.json({ error: 'Origin not allowed.' }, { status: 403 });
  if (!process.env.OPENAI_API_KEY) return Response.json({ error: 'Live grading needs OPENAI_API_KEY in the server environment. Sample mode is available.' }, { status: 503 });
  let id: unknown;
  try { const text = await request.text(); if (text.length > 200) throw new Error(); id = JSON.parse(text).id; } catch { return Response.json({ error: 'Send a seed company id.' }, { status: 400 }); }
  const company = companies.find(c => c.id === id);
  if (!company) return Response.json({ error: 'Unknown seed company.' }, { status: 400 });
  const saved = cache.get(company.id);
  if (saved && saved.until > Date.now()) return Response.json({ grade: saved.grade, cached: true });
  if (Date.now() > resetAt) { calls = 0; resetAt = Date.now() + 3600000; }
  if (inFlight >= 3 || calls >= 60) return Response.json({ error: 'Demo request limit reached. Please retry later.' }, { status: 429 });
  calls++; inFlight++;
  try {
    const response = await fetch('https://api.openai.com/v1/decisions', { method: 'POST', headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' }, body: JSON.stringify(requestBody(company)), signal: AbortSignal.timeout(45000) });
    if (!response.ok) return Response.json({ error: `OpenAI returned ${response.status}. Check model access, billing and server configuration.` }, { status: 502 });
    const grade = parseGrade(await response.json());
    cache.set(company.id, { grade, until: Date.now() + 3600000 });
    return Response.json({ grade, cached: false });
  } catch { return Response.json({ error: 'Grading timed out or returned an invalid answer. Retry this company.' }, { status: 502 }); }
  finally { inFlight--; }
}
