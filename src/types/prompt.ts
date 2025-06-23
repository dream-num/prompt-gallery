import type { PromptCategory } from '../data/categories'

export interface Prompt {
  id: string
  title: string
  prompt: string
  author: string
  publish: string
  starred?: boolean
  category: PromptCategory
}

export type { PromptCategory }