export interface SEOConfig {
  title?: string
  description?: string
  keywords?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  canonicalUrl?: string
  structuredData?: object
}

export function updateSEO(config: SEOConfig) {
  // Update title
  if (config.title) {
    document.title = config.title
    updateMetaTag('og:title', config.ogTitle || config.title)
    updateMetaTag('twitter:title', config.ogTitle || config.title)
  }

  // Update description
  if (config.description) {
    updateMetaTag('description', config.description)
    updateMetaTag('og:description', config.ogDescription || config.description)
    updateMetaTag('twitter:description', config.ogDescription || config.description)
  }

  // Update keywords
  if (config.keywords) {
    updateMetaTag('keywords', config.keywords)
  }

  // Update canonical URL
  if (config.canonicalUrl) {
    updateCanonicalUrl(config.canonicalUrl)
    updateMetaTag('og:url', config.canonicalUrl)
  }

  // Update OG image
  if (config.ogImage) {
    updateMetaTag('og:image', config.ogImage)
    updateMetaTag('twitter:image', config.ogImage)
  }

  // Update structured data
  if (config.structuredData) {
    updateStructuredData(config.structuredData)
  }
}

function updateMetaTag(name: string, content: string) {
  const isProperty = name.startsWith('og:') || name.startsWith('twitter:')
  const attribute = isProperty ? 'property' : 'name'
  
  let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement
  
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, name)
    document.head.appendChild(element)
  }
  
  element.content = content
}

function updateCanonicalUrl(url: string) {
  let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement
  
  if (!canonical) {
    canonical = document.createElement('link')
    canonical.rel = 'canonical'
    document.head.appendChild(canonical)
  }
  
  canonical.href = url
}

function updateStructuredData(data: object) {
  const id = 'structured-data'
  let script = document.getElementById(id)
  
  if (!script) {
    script = document.createElement('script')
    script.id = id
    script.type = 'application/ld+json'
    document.head.appendChild(script)
  }
  
  script.textContent = JSON.stringify(data)
}

export function generatePromptStructuredData(prompt: any) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": prompt.title,
    "description": prompt.prompt.substring(0, 150) + "...",
    "author": {
      "@type": "Person",
      "name": prompt.author
    },
    "datePublished": prompt.publish,
    "category": prompt.category,
    "keywords": prompt.tags?.join(', '),
    "publisher": {
      "@type": "Organization",
      "name": "Prompt Gallery",
      "url": "https://prompt.capalyze.ai/"
    }
  }
}
