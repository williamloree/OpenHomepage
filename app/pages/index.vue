<script setup lang="ts">
const { settings, sections, loadSettings, loadSections } = useDataStore();

// Charger les données au montage
await Promise.all([loadSettings(), loadSections()]);

// Chargement dynamique des widgets depuis /widgets
const widgets = import.meta.glob("~/widgets/*.vue", { eager: true });

// Fonction pour récupérer le composant widget
const getWidgetComponent = (widgetName: string) => {
  const widgetPath = Object.keys(widgets).find((path) =>
    path.includes(`/${widgetName}.vue`)
  );
  if (widgetPath) {
    return (widgets[widgetPath] as any).default;
  }
  return null;
};
</script>

<template>
  <h1 class="text-3xl font-bold mb-8" v-if="settings?.title">
    {{ settings?.title }}
  </h1>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <div v-for="section in sections" :key="section.id" class="space-y-4">
      <div class="flex items-center gap-2">
        <UIcon v-if="section.icon" :name="section.icon" class="text-2xl" />
        <h2 class="text-xl font-semibold">{{ section.title }}</h2>
      </div>

      <div class="space-y-2">
        <LinkCard v-for="link in section.links" :key="link.url" :link="link" />
      </div>

      <div
        v-if="section.widgets && section.widgets.length > 0"
        class="space-y-2"
      >
        <component
          v-for="widget in section.widgets"
          :key="widget.id"
          :is="getWidgetComponent(widget.name)"
          v-bind="widget.props || {}"
        />
      </div>
    </div>
  </div>
</template>
