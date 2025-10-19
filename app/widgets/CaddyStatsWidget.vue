<template>
  <div
    class="p-6 rounded-sm bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-lg"
  >
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-3">
        <UIcon name="i-heroicons-server" class="w-8 h-8" />
        <div>
          <div class="text-lg font-bold">Caddy Server</div>
          <div class="text-sm opacity-90">{{ apiUrl }}</div>
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
        <div class="text-center">
          <div class="text-3xl font-bold">{{ stats.upstreams }}</div>
          <div class="text-xs opacity-90 mt-1">Upstreams</div>
        </div>
        <div class="text-center">
          <div class="text-3xl font-bold">{{ stats.healthyUpstreams }}</div>
          <div class="text-xs opacity-90 mt-1">Healthy</div>
        </div>
        <div class="text-center">
          <div class="text-3xl font-bold">{{ stats.routes }}</div>
          <div class="text-xs opacity-90 mt-1">Routes</div>
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
  interval?: number | string;
}

const props = withDefaults(defineProps<Props>(), {
  apiUrl: "http://localhost:2019",
  interval: 30,
});

interface CaddyStats {
  upstreams: number;
  healthyUpstreams: number;
  routes: number;
  status: string;
}

const stats = ref<CaddyStats | null>(null);
const loading = ref(false);
const error = ref("");
const lastUpdate = ref<Date | null>(null);
const currentTime = ref(new Date());

const intervalNumber = computed(() => {
  const val = props.interval;
  return typeof val === "string" ? parseInt(val) || 30 : val;
});

const healthPercentage = computed(() => {
  if (!stats.value || stats.value.upstreams === 0) return 100;
  return Math.round(
    (stats.value.healthyUpstreams / stats.value.upstreams) * 100
  );
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
    const upstreamsResponse = await $fetch("/api/widgets/caddy", {
      method: "POST",
      body: {
        apiUrl: props.apiUrl,
        endpoint: "/reverse_proxy/upstreams",
      },
    });

    let totalUpstreams = 0;
    let healthyUpstreams = 0;

    if (Array.isArray(upstreamsResponse.data)) {
      totalUpstreams = upstreamsResponse.data.length;
      healthyUpstreams = upstreamsResponse.data.filter(
        (u: any) => u.healthy !== false && !u.unhealthy
      ).length;
    }

    const configResponse = await $fetch("/api/widgets/caddy", {
      method: "POST",
      body: {
        apiUrl: props.apiUrl,
        endpoint: "/config/",
      },
    });

    let routesCount = 0;
    if (configResponse.data?.apps?.http?.servers) {
      Object.values(configResponse.data.apps.http.servers).forEach(
        (server: any) => {
          if (server.routes) {
            routesCount += server.routes.length;
          }
        }
      );
    }

    stats.value = {
      upstreams: totalUpstreams,
      healthyUpstreams: healthyUpstreams,
      routes: routesCount,
      status: "running",
    };

    lastUpdate.value = new Date();
  } catch (e: any) {
    error.value = `Impossible de se connecter à Caddy. Vérifiez que l'API admin est accessible sur ${props.apiUrl}`;
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
