<template>
  <div 
    v-if="prompt"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    @click="$emit('close')"
  >
    <div 
      class="bg-white rounded-lg p-4 md:p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      @click.stop
    >
      <div class="flex justify-between items-start mb-4">
        <h3 class="text-lg font-medium">Preview Effect</h3>
        <div class="flex items-center space-x-2">
          <button 
            class="p-2 text-gray-400 hover:text-gray-600 touch-manipulation"
            @click="$emit('close')"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Preview content -->
      <div class="space-y-6">
        <!-- Prompt content -->
        <div class="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
          <div class="bg-gray-100 px-4 py-3 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0 sm:space-x-2">
            <span class="text-sm font-medium text-gray-700">Prompt Content</span>
            <button 
              class="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors touch-manipulation w-full sm:w-auto"
              @click="handleCopy"
            >
              Copy
            </button>
          </div>
          <div class="p-4 md:p-6">
            <div class="prose prose-gray max-w-none">
              <pre class="whitespace-pre-wrap font-mono text-sm leading-relaxed text-gray-800 bg-white p-4 rounded border border-gray-200 shadow-sm overflow-x-auto"><code>{{ prompt.prompt }}</code></pre>
            </div>
          </div>
        </div>
        
      </div>
    </div>

    <!-- Message notification -->
    <MessageNotification 
      :message="message"
      :show="showMessage"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Prompt } from '../types/prompt'
import { clipboardService } from '../services/clipboard'
import MessageNotification from './MessageNotification.vue'

interface Props {
  prompt: Prompt | null
}

const props = defineProps<Props>()

defineEmits<{
  close: []
}>()

const message = ref('')
const showMessage = ref(false)

onMounted(() => {
  clipboardService.setMessageCallback((msg: string) => {
    message.value = msg
    showMessage.value = true
    setTimeout(() => {
      showMessage.value = false
    }, 2000)
  })
})

const handleCopy = () => {
  if (props.prompt) {
    clipboardService.copy(props.prompt.prompt)
  }
}
</script>

<style scoped>
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