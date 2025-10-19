<template>
  <div
    class="p-3 rounded-lg bg-gradient-to-br from-amber-400/30 to-orange-500/30 text-white shadow-lg backdrop-blur-md border border-white/20 dark:border-gray-700/50 transition-all"
  >
    <UIcon name="i-lucide:quote" class="w-8 h-8 mb-2 opacity-70" />
    <p class="text-lg font-medium italic mb-2">{{ quote }}</p>
    <p class="text-sm opacity-90">— {{ author }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  quote?: string;
  author?: string;
}

withDefaults(defineProps<Props>(), {
  quote:
    "La vie est un mystère qu'il faut vivre, et non un problème à résoudre.",
  author: "Gandhi",
});
</script>
