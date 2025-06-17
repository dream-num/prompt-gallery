import type { PromptCategory } from '../data/categories'

export interface Prompt {
  title: string
  prompt: string
  author: string
  publish: string
  starred?: boolean
  category: PromptCategory
}

export type { PromptCategory } 