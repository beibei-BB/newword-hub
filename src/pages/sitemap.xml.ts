import { site } from '../site.config';
import { tools, posts } from '../content';
export function GET() {
 const paths = ['/', '/about/', '/privacy/', '/contact/', '/blog/', ...tools.map(t=>`/${t.slug}/`), ...posts.map(p=>`/blog/${p.slug}/`)];
 const escape = (s:string) => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;');
 const urls = site.domain ? paths.map(p=>`<url><loc>${escape(new URL(p, site.domain).href)}</loc></url>`).join('') : '';
 return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, {headers:{'Content-Type':'application/xml; charset=utf-8'}});
}
