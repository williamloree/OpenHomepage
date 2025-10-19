<template>
  <UApp>
    <div
      class="min-h-screen flex flex-col bg-gray-50 dark:bg-background-dark text-gray-900 dark:text-gray-100 transition-colors"
    >
      <!-- 🔝 Barre de navigation -->
      <header
        class="sticky top-0 z-50 bg-white/70 dark:bg-background-dark/70 backdrop-blur-md border-b border-gray-200 dark:border-gray-800"
      >
        <UContainer class="flex justify-between items-center py-3 gap-4">
          <div class="flex items-center gap-2">
            <UIcon name="lucide:home" class="w-5 h-5 text-primary" />
            <NuxtLink
              to="/"
              class="font-semibold hover:text-primary transition"
            >
              Homepage
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
            <NuxtLink
              to="/admin"
              class="text-sm text-gray-600 dark:text-gray-300 hover:text-primary transition"
            >
              Admin
            </NuxtLink>

            <ClientOnly>
              <UButton variant="ghost" icon="i-lucide:sun" @click="toggleTheme">
                {{ colorMode.value === "dark" ? "Light" : "Dark" }}
              </UButton>
            </ClientOnly>
          </div>
        </UContainer>
      </header>

      <!-- 🧭 Contenu principal -->
      <main class="flex-1 py-8">
        <UContainer>
          <NuxtPage />
        </UContainer>
      </main>

      <!-- ⚓ Pied de page -->
      <footer
        class="border-t border-gray-200 dark:border-gray-800 text-center py-4 text-sm text-gray-500 dark:text-gray-400"
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
  </UApp>
</template>

<script setup lang="ts">
import { useColorMode } from "#imports";

const colorMode = useColorMode();
const searchQuery = ref("");

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
</script>
