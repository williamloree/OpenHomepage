<template>
  <a
    :href="link.url"
    target="_blank"
    class="bg-white/10 dark:bg-black/10 block rounded-md backdrop-blur-md shadow-lg hover:shadow-xl hover:bg-white/20 dark:hover:bg-black/20 transition-all border border-white/30 dark:border-gray-600/30"
  >
    <div class="flex items-center rounded-lg">
      <div class="p-3 h-full flex justify-center items-center bg-gray-200/80 dark:bg-gray-800/80 rounded-l-md">
        <UIcon :name="link.icon || 'i-lucide:link'" class="text-lg text-gray-700 dark:text-gray-200" />
      </div>
      <span class="px-2 text-gray-900 dark:text-gray-100">{{ link.label }}</span>
    </div>
  </a>
</template>

<script setup lang="ts">
defineProps<{ link: { label: string; url: string; icon?: string } }>()
</script>
