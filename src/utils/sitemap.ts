import { categories } from '../data/categories'

interface SitemapUrl {
  loc: string
  lastmod?: string
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority?: string
}

export function generateSitemap(): string {
  const baseUrl = 'https://prompt.capalyze.ai'
  const currentDate = new Date().toISOString().split('T')[0]
  
  const urls: SitemapUrl[] = [
    {
      loc: baseUrl,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: '1.0'
    }
  ]

  // Add category pages
  categories.forEach(category => {
    if (category.id !== 'all') {
      urls.push({
        loc: `${baseUrl}?category=${category.id}`,
        lastmod: currentDate,
        changefreq: 'weekly',
        priority: '0.8'
      })
    }
  })

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ''}
    ${url.priority ? `<priority>${url.priority}</priority>` : ''}
  </url>`).join('\n')}
</urlset>`

  return xmlContent
}
