<template>
  <div class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
    <!-- Card Header -->
    <div class="p-6 border-b">
      <div class="flex justify-between items-start">
        <div class="space-y-3 flex-1">
          <h3 class="text-lg font-semibold text-gray-900">{{ prompt.title }}</h3>
          <div class="flex items-center space-x-2">
            <span 
              class="px-2.5 py-1 text-xs rounded-full font-medium"
              :class="`${categoryColor.bg} ${categoryColor.text}`"
            >
              {{ prompt.category }}
            </span>
            <span class="text-sm text-gray-500">{{ prompt.author }}</span>
          </div>
        </div>
        <button 
          class="text-gray-400 hover:text-yellow-500 transition-colors duration-200 ml-2 p-1"
          @click="$emit('toggle-star', prompt)"
        >
          <!-- Filled star when starred -->
          <svg
            v-if="isStarred"
            class="w-5 h-5 text-yellow-400"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <!-- Outlined star when not starred -->
          <svg
            v-else
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Card Content -->
    <div class="p-4">
      <div class="relative">
        <div 
          class="prose max-w-none text-sm"
          :class="{ 'line-clamp-4': !expanded }"
        >
          <pre><code class="language-markdown">{{ !expanded ? prompt.prompt.slice(0, 150) + '...' : prompt.prompt }}</code></pre>
        </div>
        
        <button
          v-if="prompt.prompt.length > 150"
          @click="toggleExpand"
          class="absolute bottom-0 right-0 px-3 py-1 text-xs text-blue-500 hover:text-blue-600 bg-white bg-opacity-90"
        >
          {{ expanded ? 'Collapse' : 'Expand' }}
        </button>
      </div>
    </div>

    <!-- Card Footer -->
    <div class="p-4 border-t bg-gray-50 rounded-b-lg">
      <div class="flex items-center justify-between">
        <span class="text-xs text-gray-500">{{ prompt.publish }}</span>
        <div class="flex items-center space-x-2">
          <button 
            class="p-2 text-sm text-gray-500 hover:text-blue-500"
            :data-clipboard-text="prompt.prompt"
            title="Copy prompt"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
          </button>
          <button 
            class="p-2 text-sm text-gray-500 hover:text-blue-500"
            @click="$emit('open-preview', prompt)"
            title="Preview Effect"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, onUpdated, computed } from 'vue'
import type { Prompt } from '../types/prompt'
import { categories } from '../data/categories'
import { useFavoritesStore } from '../stores/favorites'
import Prism from 'prismjs'

interface Props {
  prompt: Prompt
}

const props = defineProps<Props>()

const expanded = ref(false)
const favoritesStore = useFavoritesStore()

// Get category colors
const categoryColor = computed(() => {
  const category = categories.find(cat => cat.id === props.prompt.category)
  return category ? category.color : { bg: 'bg-gray-100', text: 'text-gray-700' }
})

// Check if prompt is starred using favorites store
const isStarred = computed(() => {
  return favoritesStore.isFavorited(props.prompt.id)
})

// Events
const emit = defineEmits<{
  'toggle-star': [prompt: Prompt]
  'open-preview': [prompt: Prompt]
}>()

// Toggle expand/collapse
const toggleExpand = () => {
  expanded.value = !expanded.value
  nextTick(() => {
    Prism.highlightAll()
  })
}

// Highlight code on mount and update
onMounted(() => {
  Prism.highlightAll()
})

onUpdated(() => {
  Prism.highlightAll()
})
</script>

<style scoped>
.prose pre {
  margin: 0;
  padding: 1rem;
  background: #f3f4f6;
  border-radius: 0.5rem;
  overflow-x: auto;
}

.prose code {
  font-size: 0.875rem;
  line-height: 1.5;
  white-space: pre-wrap;
  color: #374151;
}

.line-clamp-4 {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Add transition animations */
.prose {
  transition: all 0.3s ease;
}
</style>