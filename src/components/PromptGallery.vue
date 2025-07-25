<!-- filepath: /home/dushusir/code/github/prompt-gallery/src/components/PromptGallery.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部导航 -->
    <header class="border-b bg-white">
      <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <a 
            href="/" 
            class="text-xl font-medium hover:text-blue-600 transition-colors duration-200"
          >
            Prompts Gallery
          </a>
        </div>
        <!-- Desktop buttons -->
        <div class="hidden md:flex items-center space-x-4">
          <button
            @click="showFavorites = true"
            class="relative px-3 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-400 transition-colors duration-100 text-sm flex items-center space-x-2"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span>Favorites</span>
            <span v-if="favoritesStore.favoritesCount > 0" class="text-white">
              ({{ favoritesStore.favoritesCount }})
            </span>
          </button>
          <a 
            href="https://capalyze.ai" 
            target="_blank"
            class="px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-400 transition-colors duration-100 text-sm"
          >
            Created by Capalyze
          </a>
          <a 
            href="https://github.com/dream-num/prompt-gallery/blob/main/src/data/prompts.ts" 
            target="_blank"
            class="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-300 transition-colors duration-100 text-sm"
          >
            Submit
          </a>
        </div>
        <!-- Mobile menu button -->
        <div class="md:hidden">
          <button
            @click="showMobileMenu = !showMobileMenu"
            class="p-2 text-gray-500 hover:text-gray-700"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      <!-- Mobile dropdown menu -->
      <div v-if="showMobileMenu" class="md:hidden border-t bg-white px-4 py-3 space-y-2">
        <button
          @click="showFavorites = true; showMobileMenu = false"
          class="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <span>Favorites</span>
          <span v-if="favoritesStore.favoritesCount > 0" class="text-gray-500">
            ({{ favoritesStore.favoritesCount }})
          </span>
        </button>
        <a 
          href="https://capalyze.ai" 
          target="_blank"
          class="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
        >
          Created by Capalyze
        </a>
        <a 
          href="https://github.com/dream-num/prompt-gallery/blob/main/src/data/prompts.ts" 
          target="_blank"
          class="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
        >
          Submit
        </a>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 py-6">
      <!-- 分类标签页 -->
      <div class="mb-8 border-b">
        <nav class="-mb-px overflow-x-auto scrollbar-hide" aria-label="Tabs">
          <div class="flex space-x-8 min-w-max">
            <button
              v-for="category in store.categories"
              :key="category.id"
              @click="handleCategoryChange(category.id)"
              class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm cursor-pointer flex-shrink-0"
              :class="[
                store.currentCategory === category.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              {{ category.name }}
              <span
                class="ml-2 py-0.5 px-2 rounded-full text-xs"
                :class="[
                  store.currentCategory === category.id
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 text-gray-600'
                ]"
              >
                {{ category.count }}
              </span>
            </button>
          </div>
        </nav>
      </div>

      <!-- 搜索框 -->
      <div class="mb-6">
        <div class="relative">
          <input
            type="text"
            placeholder="Search high-quality prompts..."
            v-model="searchInput"
            @input="handleSearch"
            class="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
          >
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- 标签过滤 -->
      <div class="mb-6 overflow-x-auto scrollbar-hide">
        <div class="flex gap-2 min-w-max pb-2">
          <button
            v-for="tag in store.tags"
            :key="tag"
            class="px-3 py-1 rounded-md text-sm flex-shrink-0"
            :class="[
              store.selectedTags.includes(tag)
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
            @click="store.toggleTag(tag)"
          >
            {{ tag }}
          </button>
        </div>
      </div>

      <!-- Selected tags display -->
      <div v-if="store.selectedTags.length > 0" class="mb-4 flex flex-wrap gap-2">
        <div class="text-sm text-gray-500">Selected tags：</div>
        <div
          v-for="tag in store.selectedTags"
          :key="tag"
          class="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-sm"
        >
          {{ tag }}
          <button
            class="ml-1 hover:text-blue-900"
            @click="store.toggleTag(tag)"
          >
            ×
          </button>
        </div>
      </div>

      <!-- Prompt List - Card Layout -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <PromptCard
          v-for="prompt in store.prompts"
          :key="prompt.id"
          :prompt="prompt"
          @toggle-star="toggleStar"
          @open-preview="openPreview"
        />
      </div>

      <!-- Pagination controls -->
      <div class="mt-6 flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-2">
        <button
          class="px-3 py-2 rounded-md bg-gray-100 text-gray-700 disabled:opacity-50 w-full sm:w-auto"
          :disabled="store.currentPage === 1"
          @click="store.setPage(store.currentPage - 1)"
        >
          Previous
        </button>
        
        <div class="flex space-x-1 overflow-x-auto max-w-full">
          <button
            v-for="page in store.totalPages"
            :key="page"
            class="px-3 py-2 rounded-md flex-shrink-0"
            :class="page === store.currentPage ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'"
            @click="store.setPage(page)"
          >
            {{ page }}
          </button>
        </div>

        <button
          class="px-3 py-2 rounded-md bg-gray-100 text-gray-700 disabled:opacity-50 w-full sm:w-auto"
          :disabled="store.currentPage === store.totalPages"
          @click="store.setPage(store.currentPage + 1)"
        >
          Next
        </button>

        <span class="text-gray-500 text-sm text-center">
          Page {{ store.currentPage }} of {{ store.totalPages }}
        </span>
      </div>
    </main>
  </div>

  <!-- Favorites Page Modal -->
  <div 
    v-if="showFavorites"
    class="fixed inset-0 bg-white z-50 overflow-y-auto"
  >
    <FavoritesPage @close="showFavorites = false" />
  </div>

  <!-- Preview Modal -->
  <PreviewModal 
    :prompt="previewPrompt"
    @close="closePreview"
  />

  <!-- Message notification component -->
  <MessageNotification 
    :message="copyMessage"
    :show="showMessage"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { usePromptStore } from '../stores/prompt'
import { useFavoritesStore } from '../stores/favorites'
import type { Prompt, PromptCategory } from '../types/prompt'
import PromptCard from './PromptCard.vue'
import PreviewModal from './PreviewModal.vue'
import MessageNotification from './MessageNotification.vue'
import FavoritesPage from './FavoritesPage.vue'
import Prism from 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/components/prism-lisp'
import 'prismjs/components/prism-markdown'
import 'prismjs/components/prism-json'
import ClipboardJS from 'clipboard'

interface Props {
  category?: PromptCategory
}

const props = defineProps<Props>()

const store = usePromptStore()
const favoritesStore = useFavoritesStore()
const searchInput = ref('')
const previewPrompt = ref<Prompt | null>(null)
const copyMessage = ref('')
const showMessage = ref(false)
const showFavorites = ref(false)
const showMobileMenu = ref(false)

// Helper function to get category from URL
const getUrlCategory = (): PromptCategory | null => {
  const urlParams = new URLSearchParams(window.location.search)
  const category = urlParams.get('category')
  const validCategories = ['Ecommerce', 'Social', 'Local', 'Marketing']
  
  if (category && validCategories.includes(category)) {
    return category as PromptCategory
  }
  
  return null
}

// Helper function to get search from URL
const getUrlSearch = (): string => {
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get('search') || ''
}

// Initialize store with URL parameters or props
onMounted(() => {
  // Check URL parameters first, then fallback to props
  const urlCategory = getUrlCategory()
  const urlSearch = getUrlSearch()
  
  if (urlCategory) {
    store.setCategory(urlCategory)
  } else if (props.category) {
    store.setCategory(props.category)
  }
  
  if (urlSearch) {
    // For URL-based search, update URL parameter
    store.setSearchQuery(urlSearch, true)
    searchInput.value = urlSearch
  }
  
  Prism.highlightAll()
  const clipboard = new ClipboardJS('[data-clipboard-text]')
  
  clipboard.on('success', (e) => {
    copyMessage.value = 'Copied successfully!'
    showMessage.value = true
    setTimeout(() => {
      showMessage.value = false
    }, 2000)
    e.clearSelection()
  })

  clipboard.on('error', () => {
    copyMessage.value = 'Copy failed, please copy manually'
    showMessage.value = true
    setTimeout(() => {
      showMessage.value = false
    }, 2000)
  })
})

// Handle category change with URL update
const handleCategoryChange = (categoryId: PromptCategory) => {
  store.setCategory(categoryId)
}

// Watch for category changes
watch(() => props.category, (newCategory) => {
  if (newCategory) {
    store.setCategory(newCategory)
  }
})

// Watch for store search changes and sync with input
watch(() => store.searchQuery, (newSearch) => {
  searchInput.value = newSearch
})

// Watch for URL changes (browser back/forward)
onMounted(() => {
  window.addEventListener('popstate', () => {
    const urlCategory = getUrlCategory()
    const urlSearch = getUrlSearch()
    
    if (urlCategory && urlCategory !== store.currentCategory) {
      store.setCategory(urlCategory)
    }
    
    if (urlSearch !== store.searchQuery) {
      // For URL changes, update URL parameter
      store.setSearchQuery(urlSearch, true)
      searchInput.value = urlSearch
    }
  })
})

const getCategoryUrl = (categoryId: string) => {
  const routes: Record<string, string> = {
    'Ecommerce': '/',
    'Social': '/social',
    'Local': '/local',
    'Marketing': '/marketing'
  }
  return routes[categoryId] || '/'
}

const toggleStar = (prompt: Prompt) => {
  favoritesStore.toggleFavorite(prompt.id)
}

const openPreview = async (prompt: Prompt) => {
  previewPrompt.value = prompt
}

const closePreview = () => {
  previewPrompt.value = null
}

const handleSearch = () => {
  // For manual search, don't update URL
  store.setSearchQuery(searchInput.value, false)
}
</script>

<style scoped>
/* Hide scrollbar but keep functionality */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>