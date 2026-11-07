import { mkdir, writeFile, access } from 'node:fs/promises';
import { resolve } from 'node:path';
const slug = process.argv[2];
const reserved = new Set(['about','privacy','contact','blog','404','index','robots','sitemap']);
if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || reserved.has(slug)) { console.error('Usage: npm run new-tool <slug> (lowercase letters, numbers and hyphens; avoid reserved paths)'); process.exit(1); }
const md = resolve(`src/content/tools/${slug}.md`), dir = resolve(`src/tools/${slug}`);
for (const path of [md, dir]) { try { await access(path); console.error(`Already exists: ${path}`); process.exit(1); } catch (error) { if (error.code !== 'ENOENT') throw error; } }
const label = slug.split('-').map(s => s[0].toUpperCase()+s.slice(1)).join(' ');
const date = new Date().toISOString().slice(0,10);
await mkdir(dir, {recursive:true});
await writeFile(md, `---\ntitle: "${label} - Online Tool"\ndescription: "Use ${label} online."\nh1: "${label}"\nintro: "Describe what this tool does."\ndate: "${date}"\nsteps:\n  - "Enter your information."\n  - "Run the tool."\n  - "Use the result."\nfaq:\n  - question: "What does this tool do?"\n    answer: "Describe the tool here."\n  - question: "How do I use it?"\n    answer: "Follow the steps above."\n  - question: "Is it free?"\n    answer: "Update this answer before launch."\nrelated: []\ndisclaimer: ""\n---\n`, {flag:'wx'});
await writeFile(`${dir}/index.astro`, `<div class="tool"><p>Tool placeholder: implement ${slug} here before publishing.</p></div>\n`, {flag:'wx'});
console.log(`Created src/content/tools/${slug}.md and src/tools/${slug}/index.astro. Add the tool and edit its content before publishing.`);
