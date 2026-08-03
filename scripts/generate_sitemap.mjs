import { readFile, writeFile } from 'node:fs/promises';

const base = 'https://soia-team.github.io';
const staticRoutes = [
  '/', '/products/', '/open/', '/open/experts/', '/course/', '/services/',
  '/pricing/', '/docs/', '/blog/', '/showcase/', '/spec/', '/about/',
  '/solutions/knowledge/', '/solutions/content/', '/solutions/delivery/',
];
const catalog = JSON.parse(await readFile(new URL('../soia-site/src/data/catalog.generated.json', import.meta.url), 'utf8'));
const routes = new Set(staticRoutes);
for (const domain of catalog.domains) {
  routes.add(`/open/${domain.slug}/`);
  routes.add(`/open/experts/${domain.slug}/`);
}
for (const skill of catalog.skills) routes.add(`/open/${skill.domain}/${skill.slug}/`);
for (const route of [...routes]) routes.add(`/en${route}`);

const body = [...routes].sort().map((route) => {
  const priority = route === '/' ? '1.0' : route.includes('/open/') ? '0.8' : '0.7';
  const frequency = route.includes('/open/') ? 'weekly' : 'monthly';
  return `  <url>\n    <loc>${base}${route}</loc>\n    <lastmod>2026-08-03</lastmod>\n    <changefreq>${frequency}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}).join('\n');
await writeFile(new URL('../sitemap.xml', import.meta.url), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`);
console.log(`Generated ${routes.size} sitemap routes.`);
