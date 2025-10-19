<template>
  <div class="p-4 rounded-sm bg-indigo-100 dark:bg-indigo-800 text-center">
    <p class="font-semibold">{{ text }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{ text: string }>()
</script>
