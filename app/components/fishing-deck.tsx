'use client';
import { useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { companies, sampleGrade, type Grade, type Company } from '@/lib/radar';
type Props = { grades: Record<string, Grade>; mode: 'live' | 'sample'; disabled: boolean; onCatch: (id: string, grade: Grade) => void; onInspect: (id: string) => void; onBusy: (value: boolean) => void };
const isCrew = (g: Grade) => ['Function autopilot', 'Cross-function ops'].includes(g.values.ao);
export default function FishingDeck({ grades, mode, disabled, onCatch, onInspect, onBusy }: Props) {
  const revealRef = useRef<HTMLDivElement>(null);
  const [hooked, setHooked] = useState<Company | null>(null);
  const [guess, setGuess] = useState<'crew' | 'product' | null>(null);
  const [casting, setCasting] = useState(false);
  const [error, setError] = useState('');
  const [revealed, setRevealed] = useState(false);
  const caught = companies.filter(c => grades[c.id]);
  const crews = caught.filter(c => isCrew(grades[c.id]));
  function hook(c: Company) { if (casting || disabled) return; setHooked(c); setGuess(null); setRevealed(false); setError(''); requestAnimationFrame(() => revealRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })); }
  // Random selection runs only in the two click handlers below, never during render.
  // eslint-disable-next-line react-hooks/purity
  function handleCast() { const pool = companies.filter(c => !grades[c.id]); const fish = pool.length ? pool : companies; hook(fish[Math.floor(Math.random() * fish.length)]); }
  async function reel(prediction: 'crew' | 'product') {
    if (!hooked || casting) return;
    const splash = new Promise(resolve => setTimeout(resolve, 650));
    setGuess(prediction); setCasting(true); onBusy(true); setError('');
    try {
      let g = grades[hooked.id];
      if (!g) {
        if (mode === 'sample') g = sampleGrade(hooked);
        else { const r = await fetch('/api/grade', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: hooked.id }) }); const data = await r.json(); if (!r.ok) throw Error(data.error || 'Could not reel in this catch.'); g = data.grade; }
      }
      await splash; onCatch(hooked.id, g); setRevealed(true);
    } catch(e) { setError(e instanceof Error ? e.message : 'The line got tangled. Try again.'); }
    finally { setCasting(false); onBusy(false); }
  }
  const result = hooked && revealed ? grades[hooked.id] : null;
  const resolved = result && result.values.ao !== 'Unknown';
  const matched = resolved && guess === (isCrew(result) ? 'crew' : 'product');
  return <section className="fishing-deck" aria-label="Fish for agent-operated organisations">
    <div className="fishing-intro"><div><div className="eyebrow">fAO / THE AUTONOMOUS ORGANISATION FISHING CLUB</div><h1>Something’s<br /><span>running this company.</span></h1><p>A tiny human crew? A swarm of agents?<br />Catch a company. Make your call. Reel in the evidence.</p></div><div className="join-qr"><QRCodeSVG title="Scan to fish on your own phone" value="https://ao-radar-bice.vercel.app/#fishing" size={88} bgColor="#ffffff" fgColor="#3b32a1" marginSize={2}/><div><b>FISH ALONG</b><span>Scan. Pick a fish.<br />Play on your phone.</span></div></div></div>
    <div className="pond-shell" id="fishing"><div className="pond-top"><span>● THE OPEN WATER</span><span>{mode === 'live' ? 'LIVE DECISIONS' : 'ILLUSTRATIVE SAMPLE'} · 12 SIGNALS</span></div>
    <div className={`pond ${casting ? 'is-casting' : ''}`}><div className="sun-glow" aria-hidden="true"/><div className="water-grid" aria-hidden="true"/><div className="fishing-boat" aria-hidden="true"><span>⚑</span><div>fAO</div><i/></div><div className="water-label" aria-hidden="true">THERE’S A COMPANY IN EVERY RIPPLE.</div>
      <div className="fish-school">{companies.map((c,i) => <button key={c.id} disabled={casting || disabled} className={`logo-fish fish-${i % 4} ${grades[c.id] ? 'fish-caught' : ''} ${hooked?.id === c.id ? 'fish-hooked' : ''}`} style={{ '--delay': `${-i * 0.7}s`, '--fish-color': ['#ffdf4d','#51f5cb','#ff9279','#d9b6ff'][i % 4] } as React.CSSProperties} onClick={() => hook(c)} aria-label={`Catch ${c.name}`}><span className="fish-tail" aria-hidden="true"/><span className="fish-body"><img src={`https://www.google.com/s2/favicons?domain=${encodeURIComponent(c.domain)}&sz=64`} alt="" width="28" height="28" onError={e => { e.currentTarget.style.visibility = 'hidden'; }}/><i aria-hidden="true"/></span><b>{c.name}</b><small>{grades[c.id] ? 'CAUGHT ✓' : 'CLICK TO HOOK'}</small></button>)}</div>
      <div className="pond-bottom"><span>12 COMPANIES · NO TWO CREWS ALIKE</span><button className="cast-button" disabled={casting || disabled} onClick={handleCast}>{casting ? 'Reeling in…' : '↝ Cast a line'}</button><span>OR PICK A LOGO-FISH ↑</span></div></div>
    <div ref={revealRef} className="catch-zone" aria-live="polite">{!hooked ? <div className="catch-instructions"><span>01 <b>HOOK A COMPANY</b></span><span>02 <b>GUESS WHO’S WORKING</b></span><span>03 <b>LET THE EVIDENCE BITE</b></span></div> : <div className="catch-reveal"><div className="catch-company"><span className="catch-icon">{casting ? '◌' : result ? '✦' : '↝'}</span><div><div className="eyebrow">{casting ? 'DECISIONS IS CHECKING THE SOURCES' : revealed ? 'YOUR CATCH IS IN' : 'YOU HOOKED A COMPANY'}</div><h2>{hooked.name}</h2><p>{hooked.domain}</p></div></div>{!revealed ? <div className="guess-controls"><p>Who’s doing the work? Make your call.</p><div><button disabled={casting} onClick={() => reel('crew')}>✦ Agent crew</button><button disabled={casting} onClick={() => reel('product')}>◇ AI product</button></div><small>{mode === 'sample' ? 'Sample answer · no API call' : 'Your guess is local. OpenAI Decisions assesses the source.'}</small>{error && <p className="error" role="alert">{error} Choose again to retry.</p>}</div> : result && <div className={`catch-verdict ${isCrew(result) ? 'crew-verdict' : ''}`}><div className="eyebrow">{!resolved ? 'STILL MURKY' : matched ? 'YOU READ THE WATER ✦' : 'THE EVIDENCE HAS A TWIST'}</div><h3>{isCrew(result) ? 'An agent crew. Claimed.' : result.values.ao === 'Product only' ? 'AI product. Crew unproven.' : 'Needs more operating evidence.'}</h3><p>{isCrew(result) ? `${result.values.ao} · ${result.values.lean === 'Unknown' ? 'Team size not documented' : result.values.lean}` : 'A product page alone doesn’t tell us who runs the company.'}</p><button onClick={() => onInspect(hooked.id)}>Inspect this catch ↓</button><button className="again-button" onClick={handleCast}>Cast again ↝</button></div>}</div>}</div></div>
    <div className="catch-tray"><div><span className="eyebrow">TODAY’S CATCH</span><strong>{caught.length}<small>/12 explored</small></strong></div><div className="tray-fish">{caught.length ? caught.map(c => <button key={c.id} onClick={() => hook(c)} title={`Revisit ${c.name}`} aria-label={`Revisit ${c.name}`}><img alt="" src={`https://www.google.com/s2/favicons?domain=${encodeURIComponent(c.domain)}&sz=64`} width="24" height="24"/><span>{c.name}</span></button>) : <p>An empty net is a good place to start.</p>}</div><div className="crew-count"><strong>{crews.length}</strong><span>OPERATIONS<br />CLAIMS FOUND</span></div></div><p className="pond-note">Your catches stay on this screen. Company claims are marked; a catch is a lead to investigate. {mode === 'sample' ? 'Sample mode is on.' : 'Live mode uses OpenAI Decisions.'}</p>
  </section>;
}
