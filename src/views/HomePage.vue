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
            @click="store.setCategory(category.id as PromptCategory)"
            class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
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
import { ref, watch, onMounted } from 'vue'
import { usePromptStore } from '../stores/prompt'
import type { Prompt, PromptCategory } from '../types/prompt'
import PromptCard from '../components/PromptCard.vue'
import PreviewModal from '../components/PreviewModal.vue'
import MessageNotification from '../components/MessageNotification.vue'
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
</style> 