<template>
  <div class="p-6 rounded-sm shadow-lg" :class="statusColor">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-3">
        <div class="relative">
          <UIcon :name="statusIcon" class="w-8 h-8" />
          <div
            v-if="isOnline"
            class="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"
          ></div>
        </div>
        <div>
          <div class="text-lg font-bold">{{ serviceName }}</div>
          <div class="text-sm opacity-90">{{ url }}</div>
        </div>
      </div>
      <UButton
        size="xs"
        color="neutral"
        variant="ghost"
        icon="i-lucide:refresh-cw"
        @click="checkStatus"
        :loading="checking"
      />
    </div>

    <div class="space-y-2">
      <div class="flex justify-between items-center text-sm">
        <span class="opacity-90">Statut</span>
        <span class="font-semibold">{{ statusText }}</span>
      </div>
      <div
        v-if="responseTime !== null"
        class="flex justify-between items-center text-sm"
      >
        <span class="opacity-90">Temps de réponse</span>
        <span class="font-semibold">{{ responseTime }}ms</span>
      </div>
      <div class="flex justify-between items-center text-sm">
        <span class="opacity-90">Dernière vérification</span>
        <span class="font-semibold">{{ lastCheckText }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";

interface Props {
  url?: string;
  name?: string;
  interval?: number; // Intervalle en secondes
}

const props = withDefaults(defineProps<Props>(), {
  url: "https://google.com",
  name: "Service",
  interval: 60, // Par défaut toutes les 60 secondes
});

const isOnline = ref<boolean | null>(null);
const responseTime = ref<number | null>(null);
const lastCheck = ref<Date | null>(null);
const checking = ref(false);
const intervalId = ref<NodeJS.Timeout | null>(null);
const updateIntervalId = ref<NodeJS.Timeout | null>(null);
const currentTime = ref(new Date());

const serviceName = computed(() => props.name);

const statusColor = computed(() => {
  if (isOnline.value === null) {
    return "bg-gradient-to-br from-gray-400 to-gray-500 text-white";
  }
  return isOnline.value
    ? "bg-gradient-to-br from-green-400 to-emerald-500 text-white"
    : "bg-gradient-to-br from-red-400 to-rose-500 text-white";
});

const statusIcon = computed(() => {
  if (isOnline.value === null) return "i-lucide:help-circle";
  return isOnline.value ? "i-lucide:check-circle" : "i-lucide:x-circle";
});

const statusText = computed(() => {
  if (isOnline.value === null) return "En attente...";
  return isOnline.value ? "En ligne" : "Hors ligne";
});

const lastCheckText = computed(() => {
  if (!lastCheck.value) return "Jamais";
  // Utiliser currentTime pour forcer la réactivité
  const now = currentTime.value;
  const diff = Math.floor((now.getTime() - lastCheck.value.getTime()) / 1000);

  if (diff < 60) return `Il y a ${diff}s`;
  if (diff < 3600) return `Il y a ${Math.floor(diff / 60)}m`;
  return `Il y a ${Math.floor(diff / 3600)}h`;
});

const checkStatus = async () => {
  if (checking.value) return;

  checking.value = true;
  const startTime = Date.now();

  try {
    // Appeler notre API backend pour faire le ping
    const response = await fetch("/api/widgets/ping", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: props.url }),
    });

    const data = await response.json();
    const endTime = Date.now();

    isOnline.value = data.online;
    responseTime.value = data.online ? endTime - startTime : null;
    lastCheck.value = new Date();
  } catch (e) {
    isOnline.value = false;
    responseTime.value = null;
    lastCheck.value = new Date();
  } finally {
    checking.value = false;
  }
};

onMounted(() => {
  // Première vérification immédiate
  checkStatus();

  // Puis vérification à intervalles réguliers
  if (props.interval > 0) {
    intervalId.value = setInterval(() => {
      checkStatus();
    }, props.interval * 1000);
  }

  // Mettre à jour l'heure actuelle chaque seconde pour le calcul du temps écoulé
  updateIntervalId.value = setInterval(() => {
    currentTime.value = new Date();
  }, 1000);
});

onUnmounted(() => {
  if (intervalId.value) {
    clearInterval(intervalId.value);
  }
  if (updateIntervalId.value) {
    clearInterval(updateIntervalId.value);
  }
});
</script>
