export interface CategoryConfig {
  id: string
  name: string
  color: {
    bg: string
    text: string
  }
}

export const categories: CategoryConfig[] = [
  {
    id: 'Ecommerce',
    name: 'Ecommerce',
    color: {
      bg: 'bg-purple-100',
      text: 'text-purple-700'
    }
  },
  {
    id: 'Social',
    name: 'Social Media',
    color: {
      bg: 'bg-green-100',
      text: 'text-green-700'
    }
  },
  {
    id: 'Local',
    name: 'Local',
    color: {
      bg: 'bg-blue-100',
      text: 'text-blue-700'
    }
  },
  {
    id: 'Marketing',
    name: 'Marketing',
    color: {
      bg: 'bg-orange-100',
      text: 'text-orange-700'
    }
  },
]

// Generate type from categories array
export type PromptCategory = typeof categories[number]['id']