<template>
  <div>
    <UFormGroup label="Nouvelle section">
      <div class="flex gap-2">
        <UInput v-model="newTitle" placeholder="Titre..." class="flex-1" />
        <UInput v-model="newIcon" placeholder="Icône (ex: i-lucide:star)" class="flex-1" />
        <UButton @click="addSection">Ajouter</UButton>
      </div>
    </UFormGroup>

    <div v-if="storeSections && storeSections.length > 0" class="mt-6 space-y-2">
      <div
        v-for="(element, index) in storeSections"
        :key="element.id"
        class="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-3 rounded-lg"
      >
        <div v-if="editing?.id === element.id" class="flex gap-2 w-full">
          <UInput v-model="editing.title" placeholder="Titre" class="flex-1" />
          <UInput v-model="editing.icon" placeholder="Icône (ex: i-lucide:star)" class="flex-1" />
          <UButton color="success" @click="updateSection()">✔</UButton>
          <UButton color="neutral" @click="editing = null">✖</UButton>
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
                @click="moveSection(index, 'up')"
                class="cursor-pointer"
              />
              <UButton
                size="xs"
                color="neutral"
                variant="ghost"
                icon="i-lucide:chevron-down"
                :disabled="index === storeSections.length - 1"
                @click="moveSection(index, 'down')"
                class="cursor-pointer"
              />
            </div>
            <div class="flex items-center gap-2">
              <UIcon v-if="element.icon" :name="element.icon" class="text-xl" />
              <span class="font-medium">{{ element.title }}</span>
            </div>
          </div>
          <div class="flex gap-2">
            <UButton color="primary" @click="editing = { ...element }">Modifier</UButton>
            <UButton color="error" @click="deleteSection(element.id)">Supprimer</UButton>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="mt-6 text-gray-500">
      Aucune section. Ajoutez-en une ci-dessus.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { Section } from "~/composables/useDataStore";

const {
  sections: storeSections,
  loadSections,
  addSection: addSectionToStore,
  updateSection: updateSectionInStore,
  deleteSection: deleteSectionFromStore,
  reorderSections,
} = useDataStore();

const newTitle = ref("");
const newIcon = ref("");
const editing = ref<Section | null>(null);

onMounted(() => {
  loadSections();
});

async function addSection() {
  if (!newTitle.value.trim()) return;
  await addSectionToStore(newTitle.value, newIcon.value.trim() || undefined);
  newTitle.value = "";
  newIcon.value = "";
}

async function updateSection() {
  if (!editing.value) return;
  await updateSectionInStore(editing.value);
  editing.value = null;
}

async function deleteSection(id: string) {
  await deleteSectionFromStore(id);
}

async function moveSection(index: number, direction: 'up' | 'down') {
  if (!storeSections.value) return;

  const newIndex = direction === 'up' ? index - 1 : index + 1;
  if (newIndex < 0 || newIndex >= storeSections.value.length) return;

  // Créer une copie du tableau
  const sections = [...storeSections.value];

  // Échanger les éléments
  [sections[index], sections[newIndex]] = [sections[newIndex], sections[index]];

  // Créer l'ordre des IDs
  const order = sections.map(s => s.id);

  // Mettre à jour via l'API
  await reorderSections(order);
}
</script>
