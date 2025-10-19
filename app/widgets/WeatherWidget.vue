<template>
  <div
    class="p-3 rounded-lg bg-gradient-to-br from-cyan-400/30 to-blue-500/30 text-white shadow-lg backdrop-blur-md border border-white/20 dark:border-gray-700/50 transition-all"
  >
    <div v-if="loading" class="text-center">
      <div class="text-lg">Chargement...</div>
    </div>
    <div v-else-if="error" class="text-center">
      <div class="text-sm opacity-90">{{ error }}</div>
    </div>
    <div v-else>
      <div class="flex items-center justify-between">
        <div>
          <div class="text-2xl font-bold">{{ weatherData.city }}</div>
          <div class="text-5xl font-bold mt-1">
            {{ weatherData.temperature }}°C
          </div>
        </div>
        <UIcon :name="weatherData.icon" class="w-20 h-20" />
      </div>
      <div class="mt-2 text-sm opacity-90">{{ weatherData.description }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

interface Props {
  city?: string;
  latitude?: number;
  longitude?: number;
}

const props = withDefaults(defineProps<Props>(), {
  city: "Paris",
  latitude: 48.8566,
  longitude: 2.3522,
});

const weatherData = ref({
  city: props.city,
  temperature: 0,
  description: "",
  icon: "i-lucide:sun",
});

const loading = ref(true);
const error = ref("");

// Mapper les codes météo WMO (Open-Meteo) vers les icônes Lucide
const getWeatherIcon = (weatherCode: number, isDay: boolean): string => {
  const iconMap: Record<number, { day: string; night: string }> = {
    0: { day: "i-lucide:sun", night: "i-lucide:moon" },
    1: { day: "i-lucide:sun", night: "i-lucide:moon" },
    2: { day: "i-lucide:cloud-sun", night: "i-lucide:cloud-moon" },
    3: { day: "i-lucide:cloud", night: "i-lucide:cloud" },
    45: { day: "i-lucide:cloud-fog", night: "i-lucide:cloud-fog" },
    48: { day: "i-lucide:cloud-fog", night: "i-lucide:cloud-fog" },
    51: { day: "i-lucide:cloud-drizzle", night: "i-lucide:cloud-drizzle" },
    53: { day: "i-lucide:cloud-drizzle", night: "i-lucide:cloud-drizzle" },
    55: { day: "i-lucide:cloud-drizzle", night: "i-lucide:cloud-drizzle" },
    61: { day: "i-lucide:cloud-rain", night: "i-lucide:cloud-rain" },
    63: { day: "i-lucide:cloud-rain", night: "i-lucide:cloud-rain" },
    65: { day: "i-lucide:cloud-rain", night: "i-lucide:cloud-rain" },
    71: { day: "i-lucide:cloud-snow", night: "i-lucide:cloud-snow" },
    73: { day: "i-lucide:cloud-snow", night: "i-lucide:cloud-snow" },
    75: { day: "i-lucide:cloud-snow", night: "i-lucide:cloud-snow" },
    95: { day: "i-lucide:cloud-lightning", night: "i-lucide:cloud-lightning" },
    96: { day: "i-lucide:cloud-lightning", night: "i-lucide:cloud-lightning" },
    99: { day: "i-lucide:cloud-lightning", night: "i-lucide:cloud-lightning" },
  };

  const icons = iconMap[weatherCode] || {
    day: "i-lucide:sun",
    night: "i-lucide:moon",
  };
  return isDay ? icons.day : icons.night;
};

// Mapper les codes météo WMO vers les descriptions en français
const getWeatherDescription = (weatherCode: number): string => {
  const descriptionMap: Record<number, string> = {
    0: "Ciel dégagé",
    1: "Principalement dégagé",
    2: "Partiellement nuageux",
    3: "Couvert",
    45: "Brouillard",
    48: "Brouillard givrant",
    51: "Bruine légère",
    53: "Bruine modérée",
    55: "Bruine dense",
    61: "Pluie légère",
    63: "Pluie modérée",
    65: "Pluie forte",
    71: "Neige légère",
    73: "Neige modérée",
    75: "Neige forte",
    95: "Orage",
    96: "Orage avec grêle légère",
    99: "Orage avec grêle forte",
  };
  return descriptionMap[weatherCode] || "Conditions inconnues";
};

const fetchWeather = async () => {
  try {
    loading.value = true;
    error.value = "";

    // Utiliser l'API Open-Meteo (gratuite, pas de clé API nécessaire)
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${props.latitude}&longitude=${props.longitude}&current=temperature_2m,weather_code,is_day&timezone=auto`;

    const response = await fetch(url);

    if (!response.ok) {
      error.value = "Impossible de récupérer la météo";
      loading.value = false;
      return;
    }

    const data = await response.json();

    weatherData.value = {
      city: props.city,
      temperature: Math.round(data.current.temperature_2m),
      description: getWeatherDescription(data.current.weather_code),
      icon: getWeatherIcon(
        data.current.weather_code,
        data.current.is_day === 1
      ),
    };
  } catch (e) {
    error.value = "Erreur de connexion";
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchWeather();
});
</script>
