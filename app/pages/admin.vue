<template>
  <div v-if="!isAuthenticated">
    <LoginForm />
  </div>
  <div v-else class="mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Admin Dashboard</h1>
      <UButton color="neutral" @click="handleLogout">
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide:log-out" />
          <span>Déconnexion</span>
        </div>
      </UButton>
    </div>

    <UTabs
      :items="[
        { label: 'Sections', slot: 'sections' },
        { label: 'Liens', slot: 'links' },
        { label: 'Widgets', slot: 'widgets' },
      ]"
    >
      <template #sections>
        <SectionManager />
      </template>
      <template #links>
        <LinkManager />
      </template>
      <template #widgets>
        <WidgetManager />
      </template>
    </UTabs>

    <div class="mt-6"></div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const { isAuthenticated, logout, initAuth } = useAuth()

// Restaurer l'état d'authentification au montage
onMounted(() => {
  initAuth()
})

function handleLogout() {
  logout()
}
</script>
