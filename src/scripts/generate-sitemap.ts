import { writeFileSync } from 'fs'
import { resolve } from 'path'
import { generateSitemap } from '../utils/sitemap'

function generateSitemapFile() {
  try {
    const sitemapContent = generateSitemap()
    const outputPath = resolve(process.cwd(), 'public/sitemap.xml')
    
    writeFileSync(outputPath, sitemapContent, 'utf-8')
    console.log('✅ Sitemap generated successfully at:', outputPath)
  } catch (error) {
    console.error('❌ Error generating sitemap:', error)
    process.exit(1)
  }
}

generateSitemapFile()
