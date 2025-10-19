<template>
  <div
    class="p-3 rounded-lg bg-gradient-to-br from-blue-500/30 to-cyan-600/30 text-white shadow-lg backdrop-blur-md border border-white/20 dark:border-gray-700/50 transition-all"
  >
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-3">
        <UIcon name="i-lucide:container" class="w-8 h-8" />
        <div>
          <div class="text-lg font-bold">Portainer</div>
          <a
            :href="apiUrl"
            target="_blank"
            class="text-sm opacity-90 hover:opacity-100 hover:underline transition-opacity"
          >
            {{ apiUrl }}
          </a>
        </div>
      </div>
      <UButton
        size="xs"
        variant="ghost"
        icon="i-heroicons-arrow-path"
        @click="fetchStats"
        :loading="loading"
      />
    </div>

    <div
      v-if="error"
      class="bg-red-500/20 border border-red-300/30 rounded-lg p-4 text-sm"
    >
      {{ error }}
    </div>

    <div v-else-if="stats" class="space-y-4">
      <div class="grid grid-cols-3 gap-4">
        <div class="text-center text-gray-900 dark:text-gray-100 bg-gray-200/80 dark:bg-gray-800/80 p-1 rounded-md">
          <div class="text-3xl font-bold">{{ stats.running }}</div>
          <div class="text-xs opacity-90 mt-1">Running</div>
        </div>
        <div class="text-center text-gray-900 dark:text-gray-100 bg-gray-200/80 dark:bg-gray-800/80 p-1 rounded-md">
          <div class="text-3xl font-bold">{{ stats.stopped }}</div>
          <div class="text-xs opacity-90 mt-1">Stopped</div>
        </div>
        <div class="text-center text-gray-900 dark:text-gray-100 bg-gray-200/80 dark:bg-gray-800/80 p-1 rounded-md">
          <div class="text-3xl font-bold">{{ stats.total }}</div>
          <div class="text-xs opacity-90 mt-1">Total</div>
        </div>
      </div>
    </div>

    <div class="mt-4 text-xs opacity-75">
      Dernière mise à jour: {{ lastUpdateText }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  apiUrl?: string;
  apiToken?: string;
  endpointId?: string | number;
  interval?: number | string;
}

const props = withDefaults(defineProps<Props>(), {
  apiUrl: "http://localhost:9000",
  apiToken: "",
  endpointId: "1",
  interval: 30,
});

interface PortainerStats {
  running: number;
  stopped: number;
  total: number;
}

const stats = ref<PortainerStats | null>(null);
const loading = ref(false);
const error = ref("");
const lastUpdate = ref<Date | null>(null);
const currentTime = ref(new Date());

const intervalNumber = computed(() => {
  const val = props.interval;
  return typeof val === "string" ? parseInt(val) || 30 : val;
});

const runningPercentage = computed(() => {
  if (!stats.value || stats.value.total === 0) return 0;
  return Math.round((stats.value.running / stats.value.total) * 100);
});

const lastUpdateText = computed(() => {
  if (!lastUpdate.value) return "Jamais";
  const diff = Math.floor(
    (currentTime.value.getTime() - lastUpdate.value.getTime()) / 1000
  );

  if (diff < 60) return `Il y a ${diff}s`;
  if (diff < 3600) return `Il y a ${Math.floor(diff / 60)}m`;
  return `Il y a ${Math.floor(diff / 3600)}h`;
});

const fetchStats = async () => {
  if (loading.value) return;

  loading.value = true;
  error.value = "";

  try {
    const response = await $fetch("/api/widgets/portainer", {
      method: "POST",
      body: {
        apiUrl: props.apiUrl,
        apiToken: props.apiToken,
        endpoint: `/api/endpoints/${props.endpointId}/docker/containers/json?all=1`,
      },
    });

    if (response.success && Array.isArray(response.data)) {
      const containers = response.data;

      const running = containers.filter(
        (c: any) => c.State === "running"
      ).length;
      const stopped = containers.filter(
        (c: any) => c.State !== "running"
      ).length;
      const total = containers.length;

      stats.value = {
        running,
        stopped,
        total,
      };

      lastUpdate.value = new Date();
    } else {
      throw new Error("Format de réponse invalide");
    }
  } catch (e: any) {
    const errorMsg = e.data?.message || e.message || "Erreur inconnue";
    error.value = `Erreur: ${errorMsg}. Vérifiez l'URL, le token API et l'endpoint ID.`;
  } finally {
    loading.value = false;
  }
};

// Intervalles
let fetchInterval: NodeJS.Timeout | null = null;
let timeInterval: NodeJS.Timeout | null = null;

onMounted(() => {
  // Première récupération
  fetchStats();

  // Récupération à intervalles réguliers
  if (intervalNumber.value > 0) {
    fetchInterval = setInterval(() => {
      fetchStats();
    }, intervalNumber.value * 1000);
  }

  // Mise à jour de l'heure
  timeInterval = setInterval(() => {
    currentTime.value = new Date();
  }, 1000);
});

onUnmounted(() => {
  if (fetchInterval) clearInterval(fetchInterval);
  if (timeInterval) clearInterval(timeInterval);
});
</script>
