import { site } from '../site.config';
export function GET() { return new Response(`User-agent: *\nAllow: /\n${site.domain ? `Sitemap: ${new URL('/sitemap.xml', site.domain).href}\n` : ''}`, {headers:{'Content-Type':'text/plain; charset=utf-8'}}); }
