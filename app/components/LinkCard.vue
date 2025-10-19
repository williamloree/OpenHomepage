<template>
  <a
    :href="link.url"
    target="_blank"
    class="block py-2 px-4 rounded-sm bg-white dark:bg-gray-800 shadow hover:shadow-md transition"
  >
    <div class="flex items-center gap-2">
      <UIcon :name="link.icon || 'i-lucide:link'" class="text-lg" />
      <span>{{ link.label }}</span>
    </div>
  </a>
</template>

<script setup lang="ts">
defineProps<{ link: { label: string; url: string; icon?: string } }>()
</script>
