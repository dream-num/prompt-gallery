<template>
  <div 
    v-if="prompt"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click="$emit('close')"
  >
    <div 
      class="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      @click.stop
    >
      <div class="flex justify-between items-start mb-4">
        <h3 class="text-lg font-medium">Preview Effect</h3>
        <div class="flex items-center space-x-2">
          <button 
            class="text-gray-400 hover:text-gray-600"
            @click="$emit('close')"
          >
            ✕
          </button>
        </div>
      </div>

      <!-- Preview content -->
      <div class="space-y-6">
        <!-- Prompt content -->
        <div class="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
          <div class="bg-gray-100 px-4 py-2 border-b border-gray-200 flex items-center justify-between space-x-2">
            <span class="text-sm font-medium text-gray-700">Prompt Content</span>
            <button 
            class="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
            @click="handleCopy"
          >
            Copy
          </button>
          </div>
          <div class="p-6">
            <div class="prose prose-gray max-w-none">
              <pre class="whitespace-pre-wrap font-mono text-sm leading-relaxed text-gray-800 bg-white p-4 rounded border border-gray-200 shadow-sm"><code>{{ prompt.prompt }}</code></pre>
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