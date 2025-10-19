<template>
  <UCard :ui="cardStyle">
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="relative">
            <UIcon :name="icon" :class="iconSize" />
            <div
              v-if="computedShowPulse && status === 'success'"
              class="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"
            ></div>
          </div>
          <div>
            <h3 class="font-bold" :class="titleSize">{{ title }}</h3>
            <p v-if="subtitle" class="text-sm opacity-75">{{ subtitle }}</p>
          </div>
        </div>
        <UBadge v-if="badge" :color="badgeColor" variant="subtle" size="xs">
          {{ badge }}
        </UBadge>
      </div>
    </template>

    <!-- Contenu principal -->
    <div class="space-y-4">
      <!-- Valeur principale (optionnelle) -->
      <div v-if="value !== undefined && value !== null" class="text-center">
        <div :class="valueSize" class="font-bold">{{ value }}</div>
        <p v-if="valueLabel" class="text-sm opacity-75 mt-1">{{ valueLabel }}</p>
      </div>

      <!-- Métriques (optionnelles) -->
      <div v-if="metrics && metrics.length > 0" class="space-y-2">
        <div
          v-for="(metric, index) in metrics"
          :key="index"
          class="flex justify-between items-center text-sm"
        >
          <span class="opacity-90">{{ metric.label }}</span>
          <span class="font-semibold">{{ metric.value }}</span>
        </div>
      </div>

      <!-- Contenu personnalisé via slot -->
      <slot />

      <!-- Message d'erreur -->
      <UAlert
        v-if="errorMessage"
        variant="soft"
        :title="errorMessage"
        icon="i-lucide:alert-circle"
      />
    </div>

    <template #footer v-if="$slots.footer || footerText || computedShowRefreshButton">
      <div class="flex items-center justify-between">
        <span v-if="footerText" class="text-xs opacity-75">{{ footerText }}</span>
        <div class="flex gap-2 ml-auto">
          <slot name="footer" />
          <UButton
            v-if="computedShowRefreshButton"
            size="xs"
            variant="ghost"
            icon="i-lucide:refresh-cw"
            @click="$emit('refresh')"
            :loading="loading"
          >
            {{ refreshButtonText }}
          </UButton>
        </div>
      </div>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Metric {
  label: string
  value: string | number
}

interface Props {
  // Contenu
  title?: string
  subtitle?: string
  icon?: string
  badge?: string
  value?: string | number
  valueLabel?: string

  // Métriques
  metrics?: Metric[]

  // État et couleur
  status?: 'success' | 'error' | 'warning' | 'info' | 'neutral'
  color?: 'primary' | 'green' | 'red' | 'orange' | 'blue' | 'yellow' | 'purple' | 'gray'

  // Options visuelles
  showPulse?: boolean | string  // string pour compatibilité avec WidgetManager
  titleSize?: string
  iconSize?: string
  valueSize?: string

  // Footer
  footerText?: string
  showRefreshButton?: boolean | string  // string pour compatibilité avec WidgetManager
  refreshButtonText?: string
  loading?: boolean

  // Messages
  errorMessage?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Widget Personnalisé',
  icon: 'i-lucide:box',
  status: 'neutral',
  showPulse: false,
  titleSize: 'text-lg',
  iconSize: 'w-8 h-8',
  valueSize: 'text-4xl',
  showRefreshButton: false,
  refreshButtonText: 'Actualiser',
  loading: false
})

defineEmits<{
  refresh: []
}>()

// Convertir les valeurs string en boolean si nécessaire (pour les props depuis le WidgetManager)
const computedShowPulse = computed(() => {
  if (typeof props.showPulse === 'string') {
    return props.showPulse === 'true'
  }
  return props.showPulse
})

const computedShowRefreshButton = computed(() => {
  if (typeof props.showRefreshButton === 'string') {
    return props.showRefreshButton === 'true'
  }
  return props.showRefreshButton
})

// Mapper le status vers une couleur si aucune couleur n'est définie
const effectiveColor = computed(() => {
  if (props.color) return props.color

  const statusColorMap: Record<string, string> = {
    success: 'green',
    error: 'red',
    warning: 'orange',
    info: 'blue',
    neutral: 'gray'
  }

  return statusColorMap[props.status] || 'gray'
})

// Style de la carte basé sur la couleur
const cardStyle = computed(() => {
  const colorStyles: Record<string, any> = {
    green: {
      root: 'bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-900 border-green-200 dark:border-green-800',
      header: { base: 'text-green-900 dark:text-green-100' },
      body: { base: 'text-green-800 dark:text-green-200' },
      footer: { base: 'text-green-700 dark:text-green-300' }
    },
    red: {
      root: 'bg-gradient-to-br from-red-50 to-rose-100 dark:from-red-950 dark:to-rose-900 border-red-200 dark:border-red-800',
      header: { base: 'text-red-900 dark:text-red-100' },
      body: { base: 'text-red-800 dark:text-red-200' },
      footer: { base: 'text-red-700 dark:text-red-300' }
    },
    orange: {
      root: 'bg-gradient-to-br from-orange-50 to-amber-100 dark:from-orange-950 dark:to-amber-900 border-orange-200 dark:border-orange-800',
      header: { base: 'text-orange-900 dark:text-orange-100' },
      body: { base: 'text-orange-800 dark:text-orange-200' },
      footer: { base: 'text-orange-700 dark:text-orange-300' }
    },
    blue: {
      root: 'bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-blue-950 dark:to-cyan-900 border-blue-200 dark:border-blue-800',
      header: { base: 'text-blue-900 dark:text-blue-100' },
      body: { base: 'text-blue-800 dark:text-blue-200' },
      footer: { base: 'text-blue-700 dark:text-blue-300' }
    },
    yellow: {
      root: 'bg-gradient-to-br from-yellow-50 to-amber-100 dark:from-yellow-950 dark:to-amber-900 border-yellow-200 dark:border-yellow-800',
      header: { base: 'text-yellow-900 dark:text-yellow-100' },
      body: { base: 'text-yellow-800 dark:text-yellow-200' },
      footer: { base: 'text-yellow-700 dark:text-yellow-300' }
    },
    purple: {
      root: 'bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-950 dark:to-violet-900 border-purple-200 dark:border-purple-800',
      header: { base: 'text-purple-900 dark:text-purple-100' },
      body: { base: 'text-purple-800 dark:text-purple-200' },
      footer: { base: 'text-purple-700 dark:text-purple-300' }
    },
    primary: {
      root: 'bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-950 dark:to-primary-900 border-primary-200 dark:border-primary-800',
      header: { base: 'text-primary-900 dark:text-primary-100' },
      body: { base: 'text-primary-800 dark:text-primary-200' },
      footer: { base: 'text-primary-700 dark:text-primary-300' }
    },
    gray: {
      root: 'bg-gradient-to-br from-gray-50 to-slate-100 dark:from-gray-950 dark:to-slate-900 border-gray-200 dark:border-gray-800',
      header: { base: 'text-gray-900 dark:text-gray-100' },
      body: { base: 'text-gray-800 dark:text-gray-200' },
      footer: { base: 'text-gray-700 dark:text-gray-300' }
    }
  }

  return colorStyles[effectiveColor.value] || colorStyles.gray
})

const badgeColor = computed(() => {
  if (props.status === 'success') return 'success'
  if (props.status === 'error') return 'error'
  if (props.status === 'warning') return 'warning'
  if (props.status === 'info') return 'info'
  return 'primary'
})
</script>
