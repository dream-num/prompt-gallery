import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Prompt, PromptCategory } from '../types/prompt'
import { prompts as localPrompts, tags as localTags } from '../data/prompts'
import { categories as categoryConfigs } from '../data/categories'

// Helper function to get URL parameter
const getUrlParam = (param: string): string | null => {
  if (typeof window === 'undefined') return null
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get(param)
}

// Helper function to update URL parameter
const updateUrlParam = (param: string, value: string) => {
  if (typeof window === 'undefined') return
  const url = new URL(window.location.href)
  if (value) {
    url.searchParams.set(param, value)
  } else {
    url.searchParams.delete(param)
  }
  window.history.replaceState({}, '', url.toString())
}

// Helper function to get initial category from URL or default
const getInitialCategory = (): PromptCategory => {
  const urlCategory = getUrlParam('category')
  const validCategories = categoryConfigs.map(cat => cat.id)
  
  if (urlCategory && validCategories.includes(urlCategory as PromptCategory)) {
    return urlCategory as PromptCategory
  }
  
  return 'Ecommerce' // default category
}

// Helper function to get initial search from URL
const getInitialSearch = (): string => {
  return getUrlParam('search') || ''
}

export const usePromptStore = defineStore('prompt', () => {
  const prompts = ref<Prompt[]>(localPrompts)
  const loading = ref(false)
  const tags = ref(localTags)
  const currentPage = ref(1)
  const pageSize = ref(9)
  const selectedTags = ref<string[]>([])
  const searchQuery = ref(getInitialSearch())
  const currentCategory = ref<PromptCategory>(getInitialCategory())

  const categories = computed(() => 
    categoryConfigs.map(cat => ({
      id: cat.id as PromptCategory,
      name: cat.name,
      count: prompts.value.filter(p => p.category === cat.id).length
    }))
  )

  const filteredAndSortedPrompts = computed(() => {
    let filtered = [...prompts.value]

    filtered = filtered.filter(prompt => prompt.category === currentCategory.value)

    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(prompt => 
        prompt.title.toLowerCase().includes(query) ||
        prompt.prompt.toLowerCase().includes(query) ||
        prompt.author.toLowerCase().includes(query) ||
        tags.value.some(tag => 
          tag.toLowerCase().includes(query) && 
          prompt.prompt.toLowerCase().includes(tag.toLowerCase())
        )
      )
    }

    if (selectedTags.value.length > 0) {
      filtered = filtered.filter(prompt => {
        const promptText = (prompt.title + ' ' + prompt.prompt).toLowerCase()
        return selectedTags.value.some(tag => 
          promptText.includes(tag.toLowerCase())
        )
      })
    }

    return filtered.sort((a, b) => {
      if (a.starred && !b.starred) return -1
      if (!a.starred && b.starred) return 1
      return new Date(b.publish).getTime() - new Date(a.publish).getTime()
    })
  })

  const paginatedPrompts = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    return filteredAndSortedPrompts.value.slice(start, end)
  })

  const totalPages = computed(() => 
    Math.ceil(filteredAndSortedPrompts.value.length / pageSize.value)
  )

  const setPage = (page: number) => {
    currentPage.value = page
  }

  const toggleTag = (tag: string) => {
    const index = selectedTags.value.indexOf(tag)
    if (index === -1) {
      selectedTags.value.push(tag)
    } else {
      selectedTags.value.splice(index, 1)
    }
    currentPage.value = 1
  }

  const setSearchQuery = (query: string, updateUrl: boolean = false) => {
    searchQuery.value = query
    currentPage.value = 1
    
    // Only update URL parameter if explicitly requested
    if (updateUrl) {
      updateUrlParam('search', query)
    }
  }

  const setCategory = (category: PromptCategory) => {
    currentCategory.value = category
    currentPage.value = 1
    selectedTags.value = []
    // Don't clear search when changing category
    
    // Update URL parameter
    updateUrlParam('category', category)
  }

  return {
    prompts: paginatedPrompts,
    loading,
    tags,
    fetchPrompts: () => {},
    currentPage,
    totalPages,
    setPage,
    selectedTags,
    toggleTag,
    searchQuery,
    setSearchQuery,
    categories,
    currentCategory,
    setCategory
  }
})