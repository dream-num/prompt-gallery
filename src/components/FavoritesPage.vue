<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="border-b bg-white">
      <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <button 
            @click="$emit('close')"
            class="text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 class="text-xl font-medium">Favorite Prompts</h1>
          <span class="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
            {{ store.favoritePrompts.length }}
          </span>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 py-6">
      <!-- Empty state -->
      <div v-if="store.favoritePrompts.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No favorite prompts yet</h3>
        <p class="mt-1 text-sm text-gray-500">Start exploring and star your favorite prompts!</p>
        <div class="mt-6">
          <button
            @click="$emit('close')"
            class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Browse Prompts
          </button>
        </div>
      </div>

      <!-- Favorites list -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <PromptCard
          v-for="prompt in store.favoritePrompts"
          :key="prompt.id"
          :prompt="prompt"
          @toggle-star="toggleStar"
          @open-preview="openPreview"
        />
      </div>
    </main>

    <!-- Preview Modal -->
    <PreviewModal 
      :prompt="previewPrompt"
      @close="closePreview"
    />

    <!-- Message notification -->
    <MessageNotification 
      :message="copyMessage"
      :show="showMessage"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { usePromptStore } from '../stores/prompt'
import { useFavoritesStore } from '../stores/favorites'
import type { Prompt } from '../types/prompt'
import PromptCard from './PromptCard.vue'
import PreviewModal from './PreviewModal.vue'
import MessageNotification from './MessageNotification.vue'
import ClipboardJS from 'clipboard'

defineEmits<{
  close: []
}>()

const store = usePromptStore()
const favoritesStore = useFavoritesStore()
const previewPrompt = ref<Prompt | null>(null)
const copyMessage = ref('')
const showMessage = ref(false)

onMounted(() => {
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

const toggleStar = (prompt: Prompt) => {
  favoritesStore.toggleFavorite(prompt.id)
}

const openPreview = (prompt: Prompt) => {
  previewPrompt.value = prompt
}

const closePreview = () => {
  previewPrompt.value = null
}
</script>
