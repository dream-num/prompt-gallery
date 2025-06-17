import { ecommercePrompts } from './ecommerce'
import { localPrompts } from './local'
import { socialPrompts } from './social'

export const tags = [
    'Headline', 'Product', 'Description', 'Title','Email'
  ] 

export const prompts = [
  ...ecommercePrompts,
  ...localPrompts,
  ...socialPrompts
]