const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://www.wenzetiindaku.com';

const staticRoutes = [
    '/',
    '/categories',
    '/stores',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
    '/faqs',
    '/shipping',
    '/returns',
];

const generateSitemap = async () => {
    console.log('Generating sitemap...');

    // In a real scenario, you would fetch products and stores from your API here
    // For now, we provide the template.

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticRoutes
            .map(route => `  <url>
    <loc>${BASE_URL}${route}</loc>
    <changefreq>weekly</changefreq>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
  </url>`)
            .join('\n')}
</urlset>`;

    const publicPath = path.resolve(__dirname, 'public', 'sitemap.xml');
    fs.writeFileSync(publicPath, sitemap);
    console.log(`Sitemap generated at: ${publicPath}`);
};

generateSitemap().catch(console.error);
