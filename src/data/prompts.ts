import { ecommercePrompts } from './ecommerce'
import { localPrompts } from './local'
import { marketingPrompts } from './marketing'
import { socialPrompts } from './social'

export const tags = [
    'Headline', 'Product', 'Description', 'Title','Email'
  ] 

// Add unique IDs to prompts
const addIds = (prompts: any[], prefix: string) => {
  return prompts.map((prompt, index) => ({
    ...prompt,
    id: `${prefix}-${index + 1}`
  }))
}

export const prompts = [
  ...addIds(ecommercePrompts, 'ecommerce'),
  ...addIds(localPrompts, 'local'),
  ...addIds(marketingPrompts, 'marketing'),
  ...addIds(socialPrompts, 'social')
]