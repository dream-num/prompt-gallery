export interface Prompt {
  id: string
  title: string
  prompt: string
  author: string
  publish: string
  starred?: boolean
  category: 'Ecommerce' | 'Social' | 'Local'
}

export type PromptCategory = 'Ecommerce' | 'Social' | 'Local' 