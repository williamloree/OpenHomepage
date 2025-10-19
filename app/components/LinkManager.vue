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
          <div class="flex items-center gap-2">
            <UIcon v-if="section.icon" :name="section.icon" />
            <span>{{ section.title }}</span>
          </div>
        </UButton>
      </div>
      <div
        v-if="!sections || sections.length === 0"
        class="text-gray-500 text-sm mt-2"
      >
        Aucune section disponible. Créez-en une dans l'onglet "Sections".
      </div>
    </div>
    <div v-if="currentSection" class="mt-6 space-y-5">
      <h3 class="font-semibold mb-2">Ajouter un lien</h3>
      <div class="flex flex-col gap-2 md:flex-row">
        <UInput v-model="newLink.label" placeholder="Label" />
        <UInput v-model="newLink.url" placeholder="URL" />
        <UInput v-model="newLink.icon" placeholder="Icône (facultatif)" />
        <UButton @click="addLink">Ajouter</UButton>
      </div>
      <h2 class="font-semibold mb-3">Liens de {{ currentSection.title }}</h2>
      <div
        v-if="currentSection.links && currentSection.links.length > 0"
        class="space-y-2"
      >
        <div
          v-for="(element, index) in currentSection.links"
          :key="element.id"
          class="p-3 bg-gray-100 dark:bg-gray-800 rounded flex justify-between items-center"
        >
          <div
            v-if="editing?.id === element.id"
            class="flex gap-2 w-full flex-col"
          >
            <UInput v-model="editing.label" placeholder="Label" />
            <UInput v-model="editing.url" placeholder="URL" />
            <UInput v-model="editing.icon" placeholder="Icône" />
            <div class="flex gap-2">
              <UButton color="success" @click="updateLink()">✔</UButton>
              <UButton color="neutral" @click="editing = null">✖</UButton>
            </div>
          </div>
          <div v-else class="flex justify-between w-full items-center">
            <div class="flex items-center gap-3">
              <div class="flex flex-col gap-1">
                <UButton
                  size="xs"
                  color="neutral"
                  variant="ghost"
                  icon="i-lucide:chevron-up"
                  :disabled="index === 0"
                  @click="moveLink(index, 'up')"
                />
                <UButton
                  size="xs"
                  color="neutral"
                  variant="ghost"
                  icon="i-lucide:chevron-down"
                  :disabled="index === currentSection.links.length - 1"
                  @click="moveLink(index, 'down')"
                />
              </div>
              <div class="flex items-center gap-2">
                <UIcon v-if="element.icon" :name="element.icon" />
                <span>{{ element.label }}</span>
              </div>
            </div>
            <div class="flex gap-2">
              <UButton color="primary" @click="editing = { ...element }"
                >Modifier</UButton
              >
              <UButton color="error" @click="deleteLink(element.id)"
                >Supprimer</UButton
              >
            </div>
          </div>
        </div>
      </div>
      <div v-else class="text-gray-500">Aucun lien dans cette section.</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import type { Link } from "~/composables/useDataStore";

const {
  sections,
  loadSections,
  addLink: addLinkToStore,
  updateLink: updateLinkInStore,
  deleteLink: deleteLinkFromStore,
  reorderLinks,
} = useDataStore();

const selectedSection = ref<string>("");
const newLink = ref<Partial<Link>>({});
const editing = ref<Link | null>(null);

onMounted(async () => {
  await loadSections();
  // Sélectionner automatiquement la première section
  if (sections.value?.[0]) {
    selectedSection.value = sections.value[0].id;
  }
});

const currentSection = computed(() =>
  sections.value?.find((s) => s.id === selectedSection.value)
);

async function addLink() {
  if (!selectedSection.value || !newLink.value.label || !newLink.value.url)
    return;
  await addLinkToStore(
    selectedSection.value,
    newLink.value as Omit<Link, "id">
  );
  newLink.value = {};
}

async function updateLink() {
  if (!editing.value) return;
  await updateLinkInStore(editing.value);
  editing.value = null;
}

async function deleteLink(id: string) {
  await deleteLinkFromStore(id);
}

async function moveLink(index: number, direction: 'up' | 'down') {
  if (!currentSection.value || !currentSection.value.links) return;

  const newIndex = direction === 'up' ? index - 1 : index + 1;
  if (newIndex < 0 || newIndex >= currentSection.value.links.length) return;

  // Créer une copie du tableau
  const links = [...currentSection.value.links];

  // Vérifier que les éléments existent
  if (!links[index] || !links[newIndex]) return;

  // Échanger les éléments
  const temp = links[index];
  links[index] = links[newIndex];
  links[newIndex] = temp;

  // Créer l'ordre des IDs
  const order = links.map(l => l.id);

  // Mettre à jour via l'API
  await reorderLinks(selectedSection.value, order);
}
</script>
