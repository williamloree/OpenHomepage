<template>
  <div
    class="p-6 rounded-sm bg-gradient-to-br from-green-500 to-teal-600 text-white shadow-lg"
  >
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-3">
        <UIcon name="i-lucide:activity" class="w-8 h-8" />
        <div>
          <div class="text-lg font-bold">Uptime Kuma</div>
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
        <div class="text-center">
          <div class="text-3xl font-bold">{{ stats.up }}</div>
          <div class="text-xs opacity-90 mt-1">Up</div>
          <!-- <div class="mt-1">
            <div class="w-2 h-2 bg-green-300 rounded-full animate-pulse mx-auto" />
          </div> -->
        </div>
        <div class="text-center">
          <div class="text-3xl font-bold">{{ stats.down }}</div>
          <div class="text-xs opacity-90 mt-1">Down</div>
          <!-- <div class="mt-1">
            <div class="w-2 h-2 bg-red-300 rounded-full mx-auto" />
          </div> -->
        </div>
        <div class="text-center">
          <div class="text-3xl font-bold">{{ stats.total }}</div>
          <div class="text-xs opacity-90 mt-1">Total</div>
        </div>
      </div>

      <!-- <div v-if="stats.total > 0" class="pt-4 border-t border-white/20">
        <div class="flex justify-between items-center text-sm mb-2">
          <span class="opacity-90">Disponibilité</span>
          <span class="font-semibold">{{ uptimePercentage }}%</span>
        </div>
        <div class="w-full bg-white/20 rounded-full h-2">
          <div
            class="bg-green-300 rounded-full h-2 transition-all duration-500"
            :style="{ width: `${uptimePercentage}%` }"
          />
        </div>
      </div> -->
    </div>

    <div class="mt-4 text-xs opacity-75">
      Dernière mise à jour: {{ lastUpdateText }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  apiUrl?: string;
  slug?: string;
  interval?: number | string;
}

const props = withDefaults(defineProps<Props>(), {
  apiUrl: "http://localhost:3001",
  slug: "",
  interval: 30,
});

interface UptimeKumaStats {
  up: number;
  down: number;
  total: number;
}

const stats = ref<UptimeKumaStats | null>(null);
const loading = ref(false);
const error = ref("");
const lastUpdate = ref<Date | null>(null);
const currentTime = ref(new Date());

const intervalNumber = computed(() => {
  const val = props.interval;
  return typeof val === "string" ? parseInt(val) || 30 : val;
});

const uptimePercentage = computed(() => {
  if (!stats.value || stats.value.total === 0) return 100;
  return Math.round((stats.value.up / stats.value.total) * 100);
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
    console.log("Fetching Uptime Kuma stats:", {
      apiUrl: props.apiUrl,
      slug: props.slug,
    });

    // Récupérer les données de la Status Page publique
    const response = await $fetch("/api/widgets/uptime-kuma", {
      method: "POST",
      body: {
        apiUrl: props.apiUrl,
        slug: props.slug,
      },
    });

    console.log("Uptime Kuma response:", response);

    if (response.success && response.data) {
      const data: any = response.data;

      let up = 0;
      let down = 0;
      let total = 0;

      // Parcourir les groupes publics et compter les monitors
      if (data.publicGroupList && Array.isArray(data.publicGroupList)) {
        data.publicGroupList.forEach((group: any) => {
          if (group.monitorList && Array.isArray(group.monitorList)) {
            group.monitorList.forEach((monitor: any) => {
              total++;
              // Le statut peut être dans monitor.active ou autre champ
              // On vérifie si le monitor est actif/up
              if (monitor.active !== false) {
                up++;
              } else {
                down++;
              }
            });
          }
        });
      }

      stats.value = {
        up,
        down,
        total,
      };

      lastUpdate.value = new Date();
    } else {
      throw new Error("Format de réponse invalide");
    }
  } catch (e: any) {
    const errorMsg = e.data?.message || e.message || "Erreur inconnue";
    error.value = `Erreur: ${errorMsg}. Vérifiez l'URL et le slug de la status page.`;
    console.error("Uptime Kuma API error:", {
      message: e.message,
      data: e.data,
      statusCode: e.statusCode,
    });
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
