import { readdir, readFile, stat } from 'node:fs/promises';
import { resolve, join, relative, dirname } from 'node:path';
import { load } from 'cheerio';
import { transformSync } from 'esbuild';
const root = resolve('dist');
let files = [];
async function walk(dir) { for (const item of await readdir(dir, {withFileTypes:true})) { const p = join(dir,item.name); if(item.isDirectory()) await walk(p); else files.push(p); } }
try { await walk(root); } catch { console.error('Build output missing. Run npm run build first.'); process.exit(1); }
const configSource = await readFile('src/site.config.ts','utf8');
const compiled = transformSync(configSource, {loader:'ts',format:'esm'}).code;
const {site} = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
const errors = [], titles = new Map(), descriptions = new Map();
for (const required of ['about/index.html','privacy/index.html','contact/index.html','404.html']) if (!files.includes(join(root,required))) errors.push(`Missing ${required}`);
const bad = (value) => site.trademarkBlacklist.find(term => term && value.toLowerCase().includes(term.toLowerCase()));
if (bad(site.name)) errors.push('Site name contains a blacklisted trademark');
for (const file of files.filter(f=>f.endsWith('.html'))) {
 const name = relative(root,file), $ = load(await readFile(file,'utf8'));
 const urlPath = name === 'index.html' ? '/' : name.endsWith('/index.html') ? `/${name.slice(0,-10)}` : `/${name}`;
 if (bad(urlPath) || (site.domain && bad(site.domain))) errors.push(`${name}: URL contains a blacklisted trademark`);
 if ($('h1').length !== 1) errors.push(`${name}: expected exactly one H1`);
 for (const [label, value, max, seen] of [['title',$('title').text().trim(),60,titles],['description',$('meta[name="description"]').attr('content')?.trim(),160,descriptions]]) {
   if (!value || [...value].length > max) errors.push(`${name}: ${label} missing or exceeds ${max} characters`);
   else if (seen.has(value.toLowerCase())) errors.push(`${name}: duplicate ${label} with ${seen.get(value.toLowerCase())}`); else seen.set(value.toLowerCase(),name);
 }
 if (!$('meta[name="viewport"]').length) errors.push(`${name}: missing viewport`);
 $('img').each((_,el)=>{if ($(el).attr('alt') === undefined) errors.push(`${name}: image missing alt`);});
 for (const el of $('a[href],img[src],script[src],link[href]').toArray()) {
   const link = $(el).attr('href') ?? $(el).attr('src');
   if (!link || /^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(link)) continue;
   let url; try { url = new URL(link, `https://local.test${urlPath}`); } catch { errors.push(`${name}: invalid link ${link}`); continue; }
   let path; try { path = decodeURIComponent(url.pathname); } catch { errors.push(`${name}: invalid link ${link}`); continue; }
   let target = resolve(root, `.${path}`); if (target !== root && !target.startsWith(root+'/')) { errors.push(`${name}: invalid link ${link}`); continue; }
   try { if ((await stat(target)).isDirectory()) target = join(target,'index.html'); await stat(target); } catch { errors.push(`${name}: broken link ${link}`); }
 }
}
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`All checks passed (${files.filter(f=>f.endsWith('.html')).length} pages).`);
