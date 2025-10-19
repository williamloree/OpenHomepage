<template>
  <div>
    <div>
      <label class="block text-sm font-medium mb-2">Section</label>
      <div class="flex flex-wrap gap-2">
        <UButton
          v-for="section in sections"
          :key="section.id"
          :color="selectedSection === section.id ? 'primary' : 'neutral'"
          :variant="selectedSection === section.id ? 'solid' : 'outline'"
          @click="selectedSection = section.id"
        >
          {{ section.title }}
        </UButton>
      </div>
      <div v-if="!sections || sections.length === 0" class="text-gray-500 text-sm mt-2">
        Aucune section disponible. Créez-en une dans l'onglet "Sections".
      </div>
    </div>

    <div v-if="currentSection" class="mt-6">
      <h2 class="font-semibold mb-3">Widgets de {{ currentSection.title }}</h2>

      <div
        v-if="currentSection.widgets && currentSection.widgets.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <div
          v-for="widget in currentSection.widgets"
          :key="widget.id"
          class="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg"
        >
          <div class="flex justify-between items-start mb-2">
            <div>
              <div class="font-medium">{{ widget.name }}</div>
              <div class="text-xs text-gray-500">ID: {{ widget.id }}</div>
            </div>
            <UButton
              color="error"
              size="xs"
              @click="deleteWidget(widget.id)"
            >
              Supprimer
            </UButton>
          </div>
          <div v-if="widget.props" class="text-sm text-gray-600 dark:text-gray-400">
            <div v-for="(value, key) in widget.props" :key="key">
              <span class="font-medium">{{ key }}:</span> {{ value }}
            </div>
          </div>
        </div>
      </div>
      <div v-else class="text-gray-500">Aucun widget dans cette section.</div>

      <USeparator class="my-4" />

      <h3 class="font-semibold mb-3">Ajouter un widget</h3>

      <div class="mb-4">
        <label class="block text-sm font-medium mb-2">Type de widget</label>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
          <UButton
            v-for="widgetType in availableWidgets"
            :key="widgetType.name"
            :color="newWidget.name === widgetType.name ? 'primary' : 'neutral'"
            :variant="newWidget.name === widgetType.name ? 'solid' : 'outline'"
            @click="selectWidgetType(widgetType)"
          >
            {{ widgetType.label }}
          </UButton>
        </div>
      </div>

      <div v-if="newWidget.name" class="space-y-3">
        <div v-for="prop in currentWidgetProps" :key="prop.key" class="flex flex-col gap-1">
          <label class="text-sm font-medium">{{ prop.label }}</label>
          <UInput
            v-model="newWidget.props[prop.key]"
            :placeholder="prop.placeholder"
          />
        </div>
        <UButton @click="addWidget" class="w-full">Ajouter le widget</UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import type { Widget } from "~/composables/useDataStore";

const {
  sections,
  loadSections,
  addWidget: addWidgetToStore,
  deleteWidget: deleteWidgetFromStore,
} = useDataStore();

const selectedSection = ref<string>("");
const newWidget = ref<{ name: string; props: Record<string, any> }>({
  name: "",
  props: {},
});

const availableWidgets = [
  // {
  //   name: "ClockWidget",
  //   label: "Horloge",
  //   props: [],
  // },
  {
    name: "WeatherWidget",
    label: "Météo",
    props: [
      { key: "city", label: "Ville (nom d'affichage)", placeholder: "Paris" },
      { key: "latitude", label: "Latitude", placeholder: "48.8566" },
      { key: "longitude", label: "Longitude", placeholder: "2.3522" },
    ],
  },
  {
    name: "QuoteWidget",
    label: "Citation",
    props: [
      {
        key: "quote",
        label: "Citation",
        placeholder: "Votre citation...",
      },
      { key: "author", label: "Auteur", placeholder: "Gandhi" },
    ],
  },
  // {
  //   name: "StatsWidget",
  //   label: "Statistiques",
  //   props: [
  //     { key: "label", label: "Label", placeholder: "Total" },
  //     { key: "value", label: "Valeur", placeholder: "1,234" },
  //     { key: "subtitle", label: "Sous-titre", placeholder: "Cette semaine" },
  //     { key: "icon", label: "Icône", placeholder: "i-lucide:trending-up" },
  //   ],
  // },
  {
    name: "PingerWidget",
    label: "Pinger",
    props: [
      { key: "url", label: "URL à surveiller", placeholder: "https://google.com" },
      { key: "name", label: "Nom du service", placeholder: "Mon Site" },
      { key: "interval", label: "Intervalle (secondes)", placeholder: "60" },
    ],
  },
  {
    name: "CaddyStatsWidget",
    label: "Caddy Stats",
    props: [
      { key: "apiUrl", label: "URL API Caddy", placeholder: "http://localhost:2019" },
      { key: "interval", label: "Intervalle (secondes)", placeholder: "30" },
    ],
  },
  {
    name: "PortainerWidget",
    label: "Portainer",
    props: [
      { key: "apiUrl", label: "URL API Portainer", placeholder: "http://localhost:9000" },
      { key: "apiToken", label: "Token API", placeholder: "ptr_xxxxx..." },
      { key: "endpointId", label: "ID de l'endpoint", placeholder: "1" },
      { key: "interval", label: "Intervalle (secondes)", placeholder: "30" },
    ],
  },
  {
    name: "UptimeKumaWidget",
    label: "Uptime Kuma",
    props: [
      { key: "apiUrl", label: "URL Uptime Kuma", placeholder: "http://localhost:3001" },
      { key: "slug", label: "Slug de la Status Page", placeholder: "my-status" },
      { key: "interval", label: "Intervalle (secondes)", placeholder: "30" },
    ],
  },
  // {
  //   name: "ExampleWidget",
  //   label: "Exemple",
  //   props: [{ key: "text", label: "Texte", placeholder: "Votre texte..." }],
  // },
  // {
  //   name: "CustomWidget",
  //   label: "Widget Personnalisé",
  //   props: [
  //     { key: "title", label: "Titre", placeholder: "Mon Widget" },
  //     { key: "subtitle", label: "Sous-titre", placeholder: "Description..." },
  //     { key: "icon", label: "Icône", placeholder: "i-lucide:box" },
  //     { key: "badge", label: "Badge", placeholder: "Actif" },
  //     { key: "status", label: "Statut (success/error/warning/info/neutral)", placeholder: "success" },
  //     { key: "color", label: "Couleur (primary/green/red/orange/blue/yellow/purple/gray)", placeholder: "" },
  //     { key: "value", label: "Valeur principale", placeholder: "99.9%" },
  //     { key: "valueLabel", label: "Label de la valeur", placeholder: "Disponibilité" },
  //     { key: "showPulse", label: "Afficher pulsation (true/false)", placeholder: "false" },
  //     { key: "footerText", label: "Texte du footer", placeholder: "Mis à jour il y a 5min" },
  //     { key: "showRefreshButton", label: "Bouton refresh (true/false)", placeholder: "false" },
  //   ],
  // },
];

onMounted(async () => {
  await loadSections();
  if (sections.value?.[0]) {
    selectedSection.value = sections.value[0].id;
  }
});

const currentSection = computed(() =>
  sections.value?.find((s) => s.id === selectedSection.value)
);

const currentWidgetProps = computed(() => {
  const widgetType = availableWidgets.find((w) => w.name === newWidget.value.name);
  return widgetType?.props || [];
});

function selectWidgetType(widgetType: typeof availableWidgets[0]) {
  newWidget.value = {
    name: widgetType.name,
    props: {},
  };
}

async function addWidget() {
  if (!selectedSection.value || !newWidget.value.name) return;

  await addWidgetToStore(selectedSection.value, {
    name: newWidget.value.name,
    props: Object.keys(newWidget.value.props).length > 0 ? newWidget.value.props : undefined,
  });

  newWidget.value = { name: "", props: {} };
}

async function deleteWidget(id: string) {
  await deleteWidgetFromStore(id);
}
</script>
