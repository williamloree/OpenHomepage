<template>
  <div
    class="p-6 rounded-sm bg-gradient-to-br from-blue-500 to-purple-600 text-white text-center shadow-lg"
  >
    <div class="text-4xl font-bold mb-2">{{ time }}</div>
    <div class="text-sm opacity-90">{{ date }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

const time = ref("");
const date = ref("");
let intervalId: NodeJS.Timeout;

const updateTime = () => {
  const now = new Date();
  time.value = now.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  date.value = now.toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

onMounted(() => {
  updateTime();
  intervalId = setInterval(updateTime, 1000);
});

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});
</script>
