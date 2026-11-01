"""Import the public index's linked profiles. Never import its expected grades into model input."""
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from html import unescape
from html.parser import HTMLParser
import json
from pathlib import Path
import re
from urllib.request import Request, urlopen
from urllib.parse import urljoin, urlparse

ROOT = Path(__file__).resolve().parent.parent
BASE = 'https://autopilotindex.com'
DATE = datetime.now(timezone.utc).date().isoformat()
def fetch(url):
    with urlopen(Request(url, headers={'User-Agent': 'AO-Radar-Hackathon/1.0'}), timeout=30) as response:
        return response.read().decode()
class Text(HTMLParser):
    def __init__(self):
        super().__init__(); self.parts=[]
    def handle_data(self, data): self.parts.append(data)
def text(html):
    parser=Text(); parser.feed(html)
    return re.sub(r'\s+', ' ', ' '.join(parser.parts)).strip()
def section(html, title):
    match=re.search(r'<h2[^>]*>'+re.escape(title)+r'</h2>(.*?)(?=<h2|</main>)', html, re.S)
    return match.group(1) if match else ''
def paragraphs(html):
    return [text(p) for p in re.findall(r'<p\b[^>]*>(.*?)</p>', html, re.S) if text(p) not in ['Vendor claim', 'Published terms']]
def profile(path):
    url=urljoin(BASE,path); html=fetch(url)
    name=text(re.search(r'<h1[^>]*>(.*?)</h1>',html,re.S).group(1))
    website=re.search(r'<a\b[^>]*href="([^"]+)"[^>]*>\s*Visit company website',html,re.S)
    verified=website is not None
    website=unescape(website.group(1)) if website else url; proposition=paragraphs(section(html,'The recorded proposition'))
    humans=paragraphs(section(html,'Where humans remain involved'))
    team=re.search(r'>Reported team</dt>\s*<dd[^>]*>(.*?)(?=<p|</dd>)',html,re.S)
    founders=[text(n) for n in re.findall(r'<h3[^>]*>(.*?)</h3>',section(html,'Founders and recorded roles'),re.S)]
    return {'name':name,'websiteVerified':verified,'website':website,'profile':url,'proposition':proposition,'humanInvolvement':humans[:1], 'headcount':text(team.group(1)) if team else 'Unknown','founders':founders}

homepage=fetch(BASE+'/')
paths=list(dict.fromkeys(re.findall(r'href="(/companies/[^"?#]+)"',homepage)))
if len(paths)!=34: raise ValueError(f'Expected 34 public company profiles; got {len(paths)}. Review before changing the dataset.')
with ThreadPoolExecutor(max_workers=4) as pool: records=list(pool.map(profile,paths))
if len({urlparse(r['website']).hostname for r in records if r['websiteVerified']})!=sum(r['websiteVerified'] for r in records): raise ValueError('Duplicate company websites; review import.')
old_seeds=json.loads((ROOT/'lib/seed.json').read_text()); old_sources=json.loads((ROOT/'lib/evidence.json').read_text())
old_visual=json.loads((ROOT/'lib/visual-evidence.json').read_text()); old_context=json.loads((ROOT/'lib/context-captures.json').read_text())
old_alexandria=json.loads((ROOT/'lib/alexandria-coverage.json').read_text())
old={s['name'].lower():{'seed':s,'source':old_sources[i],'visual':old_visual[i], 'context':old_context.get(str(i)), 'alexandria':old_alexandria['profiles'].get(str(i)), 'image':(ROOT/f'public/captures/{i}.png').read_bytes() if (ROOT/f'public/captures/{i}.png').exists() else None} for i,s in enumerate(old_seeds)}
seeds=[]; sources=[]; visual=[]; context={}; profiles={}
for i,r in enumerate(records):
    domain=urlparse(r['website']).hostname.removeprefix('www.')
    # Preserve a previously reviewed corrected domain (MEDVi) rather than reverting to an old directory URL.
    previous=old.get(r['name'].lower()) or next((v for v in old.values() if v['seed']['domain']==domain and v['seed'].get('website_verified',True)),None)
    if previous: domain=previous['seed']['domain']; r['website']=previous['seed']['website_url']
    description=' '.join(r['proposition'])
    seed={'name':r['name'],'domain':domain,'website_url':r['website'],'website_verified':r['websiteVerified'],'profile_url':r['profile'],'headcount':r['headcount'],'stack_hint':'Imported from Autopilot Index. Read the linked record and underlying sources; inclusion is not proof of autonomy.'}
    seeds.append(seed)
    sources.append(previous['source'] if previous else {'url':r['profile'],'title':f"Autopilot Index: {r['name']}",'summary':f"Autopilot Index describes {r['name']} as follows: {description} Human involvement noted by the directory: {' '.join(r['humanInvolvement'])} This is a directory research summary, not a fresh first-party verification. Existing directory ratings and financial figures are excluded from this assessment.",'scope':'Company operations; directory research','kind':'Directory research','capturedAt':DATE})
    if previous:
        visual.append(previous['visual'])
        if previous['image']: (ROOT/f'public/captures/{i}.png').write_bytes(previous['image'])
        if previous['context']: context[str(i)]=previous['context']
        if previous['alexandria']: profiles[str(i)]=previous['alexandria']
    else:
        visual.append({'cta':'','capturedAt':DATE,'provider':'Not captured','captureNote':'Website capture pending.','reviewNote':'','socialLinks':[], 'founder':{'name':', '.join(r['founders']),'url':r['profile']} if r['founders'] else None})
        # Reused numeric filenames must never show a different company's old capture.
        image=ROOT/f'public/captures/{i}.png'
        if image.exists(): image.unlink()
    print(f"{i:02} {r['name']} | {domain} | {r['headcount']} | {description[:150]}")
for name,data in [('seed',seeds),('evidence',sources),('visual-evidence',visual),('context-captures',context)]:
    (ROOT/f'lib/{name}.json').write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
old_alexandria['profiles']=profiles
(ROOT/'lib/alexandria-coverage.json').write_text(json.dumps(old_alexandria,ensure_ascii=False,indent=2)+'\n')
(ROOT/'lib/index-import.json').write_text(json.dumps({'source':BASE+'/','importedAt':datetime.now(timezone.utc).isoformat(),'count':len(records),'records':records},ensure_ascii=False,indent=2)+'\n')
