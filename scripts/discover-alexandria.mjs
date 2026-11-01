import {writeFile} from 'node:fs/promises';
if(!process.env.FIRECRAWL_API_KEY) {console.log('Alexandria needs FIRECRAWL_API_KEY in .env.local. No request made.');process.exit(1);}
const query=process.argv.slice(2).join(' ')||'Public company founder social profiles and active advertising creatives';
const r=await fetch('https://api.firecrawl.dev/v2/search',{method:'POST',headers:{Authorization:`Bearer ${process.env.FIRECRAWL_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify({query,sources:['alexandria'],limit:3}),signal:AbortSignal.timeout(45000)});
if(!r.ok){console.log(`Alexandria discovery failed: HTTP ${r.status}`);process.exit(1);}
const data=await r.json();await writeFile('/tmp/ao-alexandria-discovery.json',JSON.stringify(data,null,2));console.log('Alexandria provider discovery saved to /tmp/ao-alexandria-discovery.json. Inspect each tool input, execution price and provider terms before execution. No paid provider tool was executed.');
