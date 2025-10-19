import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: ['@nuxt/ui'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  runtimeConfig: {
    adminPassword: process.env.ADMIN_PASSWORD || 'admin',
  },

  nitro: {
    storage: {
      data: {
        driver: 'fs',
        base: './server/db',
      },
    },
  },
})