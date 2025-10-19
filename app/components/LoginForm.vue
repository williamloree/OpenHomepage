<template>
  <div
    class="flex items-center justify-center bg-gray-50 dark:bg-background-dark"
  >
    <div
      class="max-w-md w-full space-y-3 p-8 bg-white dark:bg-gray-800 rounded-sm shadow-lg"
    >
      <div>
        <h2 class="text-center text-3xl font-bold">Admin</h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Entrez le mot de passe pour accéder à l'administration
        </p>
      </div>
      <UForm @submit.prevent="handleLogin" class="space-y-3">
        <div>
          <UFormField label="Mot de passe">
            <UInput
              v-model="password"
              type="password"
              placeholder="admin"
              size="lg"
              class="w-full"
              :error="error"
            />
          </UFormField>
          <p v-if="error" class="mt-2 text-sm text-red-600 dark:text-red-400">
            Mot de passe incorrect
          </p>
        </div>
        <UButton
          type="submit"
          color="primary"
          size="lg"
          block
          :loading="loading"
        >
          Se connecter
        </UButton>
      </UForm>
    </div>
  </div>
</template>

<script setup lang="ts">
const { login } = useAuth();
const password = ref("");
const error = ref(false);
const loading = ref(false);

async function handleLogin() {
  error.value = false;
  loading.value = true;

  try {
    const success = await login(password.value);
    if (!success) {
      error.value = true;
      password.value = "";
    }
  } catch (e) {
    error.value = true;
    password.value = "";
  } finally {
    loading.value = false;
  }
}
</script>
