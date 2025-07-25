<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部导航 -->
    <header class="border-b">
      <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <router-link 
            to="/" 
            class="text-xl font-medium hover:text-blue-600 transition-colors duration-200"
          >
            Prompts Gallery
          </router-link>
        </div>
        <!-- Desktop buttons -->
        <div class="hidden md:flex items-center space-x-4">
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
              @click="store.setCategory(category.id as PromptCategory)"
              class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex-shrink-0"
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
import { ref, watch, onMounted, computed } from 'vue'
import { usePromptStore } from '../stores/prompt'
import type { Prompt, PromptCategory } from '../types/prompt'
import PromptCard from '../components/PromptCard.vue'
import PreviewModal from '../components/PreviewModal.vue'
import MessageNotification from '../components/MessageNotification.vue'
import { updateSEO } from '../utils/seo'
import Prism from 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/components/prism-lisp'
import 'prismjs/components/prism-markdown'
import 'prismjs/components/prism-json'
import ClipboardJS from 'clipboard'

const store = usePromptStore()
const searchInput = ref('')
const previewPrompt = ref<Prompt | null>(null)
const copyMessage = ref('')
const showMessage = ref(false)
const showMobileMenu = ref(false)

// SEO optimization
const pageTitle = computed(() => {
  const category = store.currentCategory
  const searchQuery = store.searchQuery
  
  if (searchQuery) {
    return `Search: ${searchQuery} - Prompt Gallery`
  }
  
  if (category && category !== 'all') {
    return `${category} Prompts - Prompt Gallery`
  }
  
  return 'Prompt Gallery - High-Quality AI Prompts Collection'
})

const pageDescription = computed(() => {
  const category = store.currentCategory
  const totalPrompts = store.prompts.length
  
  if (category && category !== 'all') {
    return `Explore ${totalPrompts} high-quality ${category.toLowerCase()} prompts for ChatGPT, Claude, and other AI models. Perfect for ${category.toLowerCase()} professionals and enthusiasts.`
  }
  
  return `Discover ${totalPrompts} high-quality AI prompts across multiple categories including social media, ecommerce, marketing, and local business. Free AI prompt library for ChatGPT, Claude, and more.`
})

const pageKeywords = computed(() => {
  const category = store.currentCategory
  const basekeywords = 'AI prompts, ChatGPT prompts, Claude prompts, AI prompt library'
  
  if (category && category !== 'all') {
    return `${basekeywords}, ${category.toLowerCase()} prompts, ${category.toLowerCase()} AI assistance`
  }
  
  return `${basekeywords}, social media prompts, ecommerce prompts, marketing prompts, local business prompts`
})

// Update SEO when page changes
watch([() => store.currentCategory, () => store.searchQuery, () => store.prompts], () => {
  updateSEO({
    title: pageTitle.value,
    description: pageDescription.value,
    keywords: pageKeywords.value,
    canonicalUrl: `https://prompt.capalyze.ai/${store.currentCategory !== 'all' ? '?category=' + store.currentCategory : ''}`,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": pageTitle.value,
      "description": pageDescription.value,
      "url": `https://prompt.capalyze.ai/`,
      "numberOfItems": store.prompts.length,
      "about": {
        "@type": "Thing",
        "name": "AI Prompts",
        "description": "High-quality prompts for artificial intelligence models"
      }
    }
  })
}, { immediate: true })

// Initialize code highlighting and clipboard
onMounted(() => {
  Prism.highlightAll()
  const clipboard = new ClipboardJS('[data-clipboard-text]')
  
  clipboard.on('success', (e) => {
    // Show copy success message
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

// Expand/collapse prompt
// Note: Functionality moved to PromptCard component

// Toggle star for prompt
const toggleStar = (prompt: Prompt) => {
  prompt.starred = !prompt.starred
}

// Open preview
const openPreview = async (prompt: Prompt) => {
  previewPrompt.value = prompt
}

// Close preview
const closePreview = () => {
  previewPrompt.value = null
}

// Handle search input
const handleSearch = () => {
  store.setSearchQuery(searchInput.value)
}

// Watch tag changes
watch(() => store.selectedTags, () => {
  // Can add additional handling logic here
}, { deep: true })
</script>

<style>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Add modal animations */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* Hide scrollbar but keep functionality */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>