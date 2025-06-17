<template>
  <div 
    v-if="show"
    class="fixed inset-x-0 top-20 flex items-center justify-center z-[60]"
  >
    <div class="bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-300 transform">
      <div class="flex items-center space-x-2">
        <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <span>{{ message }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  message: string
  show: boolean
}

defineProps<Props>()
</script>