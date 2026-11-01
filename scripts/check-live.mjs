import { writeFile } from 'node:fs/promises';
const base = process.argv[2] || 'http://127.0.0.1:3000';
const rows = [];
const seeds = JSON.parse(await (await import('node:fs/promises')).readFile(new URL('../lib/seed.json', import.meta.url), 'utf8'));
for(let i=0;i<seeds.length;i++) {
 const start=Date.now();
 const r=await fetch(`${base}/api/grade`,{method:'POST',headers:{'Content-Type':'application/json',Origin:base},body:JSON.stringify({id:String(i),name:seeds[i].name}),signal:AbortSignal.timeout(55000)});
 const data=await r.json();
 const ok=r.ok && data.grade?.mode==='live' && ['ao','lean','buyer','evidence'].every(k=>typeof data.grade.values[k]==='string');
 rows.push({id:String(i),status:r.status,ok,ms:Date.now()-start,...data});
 console.log(JSON.stringify(rows.at(-1)));
 if(!ok) { process.exitCode=1; break; }
}
await writeFile('/tmp/ao-radar-live-check.json',JSON.stringify({base,checkedAt:new Date().toISOString(),rows},null,2));
