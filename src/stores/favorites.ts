import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const FAVORITES_KEY = 'prompt-gallery-favorites'

export const useFavoritesStore = defineStore('favorites', () => {
  const starredPromptIds = ref<Set<string>>(new Set())

  // Load favorites from localStorage
  const loadFavorites = () => {
    if (typeof window === 'undefined') return
    
    try {
      const stored = localStorage.getItem(FAVORITES_KEY)
      if (stored) {
        const ids = JSON.parse(stored)
        starredPromptIds.value = new Set(ids)
      }
    } catch (error) {
      console.error('Failed to load favorites from localStorage:', error)
    }
  }

  // Save favorites to localStorage
  const saveFavorites = () => {
    if (typeof window === 'undefined') return
    
    try {
      const ids = Array.from(starredPromptIds.value)
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids))
    } catch (error) {
      console.error('Failed to save favorites to localStorage:', error)
    }
  }

  // Toggle favorite status
  const toggleFavorite = (promptId: string) => {
    if (starredPromptIds.value.has(promptId)) {
      starredPromptIds.value.delete(promptId)
    } else {
      starredPromptIds.value.add(promptId)
    }
    saveFavorites()
  }

  // Check if prompt is favorited
  const isFavorited = (promptId: string) => {
    return starredPromptIds.value.has(promptId)
  }

  // Get count of favorites
  const favoritesCount = computed(() => starredPromptIds.value.size)

  // Initialize
  loadFavorites()

  return {
    starredPromptIds,
    toggleFavorite,
    isFavorited,
    favoritesCount,
    loadFavorites
  }
})
