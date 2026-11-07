import matter from 'gray-matter';
const toolFiles = import.meta.glob('./content/tools/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
const blogFiles = import.meta.glob('./content/blog/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
function parse(files: Record<string, string>) {
  return Object.entries(files).map(([path, raw]) => {
    const slug = path.split('/').pop()!.replace(/\.md$/, '');
    const { data, content } = matter(raw);
    return { slug, data, content };
  }).sort((a, b) => String(b.data.date).localeCompare(String(a.data.date)) || a.slug.localeCompare(b.slug));
}
export const tools = parse(toolFiles);
export const posts = parse(blogFiles);
