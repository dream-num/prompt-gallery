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
        <div class="flex items-center space-x-4">
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
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 py-6">
      <!-- 分类标签页 -->
      <div class="mb-8 border-b">
        <nav class="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            v-for="category in store.categories"
            :key="category.id"
            @click="handleCategoryChange(category.id)"
            class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm cursor-pointer"
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
            class="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- 标签过滤 -->
      <div class="mb-6 flex flex-wrap gap-2">
        <button
          v-for="tag in store.tags"
          :key="tag"
          class="px-3 py-1 rounded-md text-sm"
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
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <PromptCard
          v-for="prompt in store.prompts"
          :key="prompt.id"
          :prompt="prompt"
          @toggle-star="toggleStar"
          @open-preview="openPreview"
        />
      </div>

      <!-- Pagination controls -->
      <div class="mt-6 flex justify-center items-center space-x-2">
        <button
          class="px-3 py-1 rounded-md bg-gray-100 text-gray-700 disabled:opacity-50"
          :disabled="store.currentPage === 1"
          @click="store.setPage(store.currentPage - 1)"
        >
          Previous
        </button>
        
        <div class="flex space-x-1">
          <button
            v-for="page in store.totalPages"
            :key="page"
            class="px-3 py-1 rounded-md"
            :class="page === store.currentPage ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'"
            @click="store.setPage(page)"
          >
            {{ page }}
          </button>
        </div>

        <button
          class="px-3 py-1 rounded-md bg-gray-100 text-gray-700 disabled:opacity-50"
          :disabled="store.currentPage === store.totalPages"
          @click="store.setPage(store.currentPage + 1)"
        >
          Next
        </button>

        <span class="text-gray-500 text-sm">
          Page {{ store.currentPage }} of {{ store.totalPages }}
        </span>
      </div>
    </main>
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
import type { Prompt, PromptCategory } from '../types/prompt'
import PromptCard from './PromptCard.vue'
import PreviewModal from './PreviewModal.vue'
import MessageNotification from './MessageNotification.vue'
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
const searchInput = ref('')
const previewPrompt = ref<Prompt | null>(null)
const copyMessage = ref('')
const showMessage = ref(false)

// Initialize store with URL category or prop category
onMounted(() => {
  // Check URL parameters first, then fallback to props
  const urlCategory = getUrlCategory()
  if (urlCategory) {
    store.setCategory(urlCategory)
  } else if (props.category) {
    store.setCategory(props.category)
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

// Handle category change with URL update
const handleCategoryChange = (categoryId: PromptCategory) => {
  store.setCategory(categoryId)
}

// Watch for category changes
watch(() => props.category, (newCategory) => {
  store.setCategory(newCategory)
})

// Watch for URL changes (browser back/forward)
onMounted(() => {
  window.addEventListener('popstate', () => {
    const urlCategory = getUrlCategory()
    if (urlCategory && urlCategory !== store.currentCategory) {
      store.setCategory(urlCategory)
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
  prompt.starred = !prompt.starred
}

const openPreview = async (prompt: Prompt) => {
  previewPrompt.value = prompt
}

const closePreview = () => {
  previewPrompt.value = null
}

const handleSearch = () => {
  store.setSearchQuery(searchInput.value)
}
</script>