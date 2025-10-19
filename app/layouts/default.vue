<template>
  <div
    class="min-h-screen flex flex-col text-gray-900 dark:text-gray-100 transition-colors relative"
  >
    <!-- Background image avec blur -->
    <div
      v-if="settings?.background"
      class="fixed inset-0 -z-10"
      :style="{
        backgroundImage: `url(${settings.background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        filter: 'blur(8px)',
        transform: 'scale(1.1)',
      }"
    ></div>

    <!-- Overlay pour assombrir le background si nécessaire -->
    <div
      v-if="settings?.background"
      class="fixed inset-0 -z-10 bg-black/30 dark:bg-black/50"
    ></div>

    <!-- Fallback background sans image -->
    <div
      v-if="!settings?.background"
      class="fixed inset-0 -z-10 bg-gray-50 dark:bg-background-dark"
    ></div>

    <!-- 🔝 Barre de navigation -->
    <header
      class="sticky top-0 z-50 bg-white/70 dark:bg-background-dark/70 backdrop-blur-md border-b border-gray-200 dark:border-gray-800"
    >
      <UContainer class="flex justify-between items-center py-3 gap-4">
        <div class="flex items-center gap-2">
          <UIcon name="lucide:home" class="w-5 h-5 text-primary" />
          <NuxtLink to="/" class="font-semibold hover:text-primary transition">
            {{ settings?.appName || "Homepage" }}
          </NuxtLink>
        </div>

        <div class="flex-1 max-w-xl">
          <form @submit.prevent="handleSearch" class="relative">
            <UInput
              v-model="searchQuery"
              placeholder="Rechercher sur Google..."
              icon="i-lucide:search"
              size="md"
              class="w-full"
              @keydown.enter="handleSearch"
            />
          </form>
        </div>

        <div class="flex items-center gap-3">
          <NuxtLink to="/admin"> Admin </NuxtLink>

          <ClientOnly>
            <UButton
              variant="ghost"
              icon="i-lucide:sun"
              @click="toggleTheme"
              class="cursor-pointer"
            >
              {{ colorMode.value === "dark" ? "Light" : "Dark" }}
            </UButton>
          </ClientOnly>
          <ClientOnly>
            <div class="text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ currentTime }}
            </div>
          </ClientOnly>
        </div>
      </UContainer>
    </header>

    <!-- 🧭 Contenu principal -->
    <main class="flex-1 py-8">
      <UContainer>
        <slot />
      </UContainer>
    </main>

    <!-- ⚓ Pied de page -->
    <footer
      class="bg-white/70 dark:bg-background-dark/70 border-t border-gray-200 dark:border-gray-800 text-center py-4 text-sm text-gray-500 dark:text-gray-400"
    >
      © {{ new Date().getFullYear() }} OpenHomepage —
      <a
        href="https://github.com/williamloree/OpenHomepage"
        target="_blank"
        class="hover:underline text-primary"
        >Github</a
      >
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useColorMode } from "#imports";

const colorMode = useColorMode();
const searchQuery = ref("");
const currentTime = ref("");

// Récupération des settings pour le background
const { data: settings } = await useFetch("/api/settings");

function updateTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  currentTime.value = `${hours}:${minutes}`;
}

function toggleTheme() {
  colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
}

function handleSearch() {
  if (searchQuery.value.trim()) {
    window.open(
      `https://www.google.com/search?q=${encodeURIComponent(
        searchQuery.value
      )}`,
      "_blank"
    );
    searchQuery.value = "";
  }
}

// Mise à jour de l'heure toutes les secondes
onMounted(() => {
  updateTime();
  setInterval(updateTime, 1000);
});
</script>
