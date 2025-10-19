<template>
  <div
    class="p-6 rounded-sm bg-gradient-to-br from-green-400 to-emerald-600 text-white shadow-lg"
  >
    <div class="flex items-center justify-between mb-2">
      <span class="text-sm font-medium opacity-90">{{ label }}</span>
      <UIcon :name="icon" class="w-6 h-6" />
    </div>
    <div class="text-4xl font-bold">{{ value }}</div>
    <div class="text-sm opacity-75 mt-2">{{ subtitle }}</div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  label?: string;
  value?: string | number;
  subtitle?: string;
  icon?: string;
}

withDefaults(defineProps<Props>(), {
  label: "Total",
  value: "1,234",
  subtitle: "Cette semaine",
  icon: "i-lucide:trending-up",
});
</script>
