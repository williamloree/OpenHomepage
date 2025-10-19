<template>
  <div
    class="p-6 rounded-sm bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg"
  >
    <UIcon name="i-lucide:quote" class="w-8 h-8 mb-3 opacity-70" />
    <p class="text-lg font-medium italic mb-3">{{ quote }}</p>
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
