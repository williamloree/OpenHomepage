export interface Link {
  id: string
  label: string
  url: string
  icon?: string
}

export interface Widget {
  id: string
  name: string
  props?: Record<string, any>
}

export interface Section {
  id: string
  title: string
  icon?: string
  links: Link[]
  widgets?: Widget[]
}

export interface Settings {
  title: string
}

const settings = ref<Settings | null>(null)
const sections = ref<Section[]>([])
const isLoading = ref(false)
const error = ref<Error | null>(null)

export const useDataStore = () => {
  // Charger les param�tres
  const loadSettings = async () => {
    if (settings.value) return settings.value

    try {
      isLoading.value = true
      settings.value = await $fetch('/api/settings')
      return settings.value
    } catch (e) {
      error.value = e as Error
      throw e
    } finally {
      isLoading.value = false
    }
  }

  // Charger les sections
  const loadSections = async () => {
    try {
      isLoading.value = true
      sections.value = await $fetch('/api/sections')
      return sections.value
    } catch (e) {
      error.value = e as Error
      throw e
    } finally {
      isLoading.value = false
    }
  }

  // Ajouter une section
  const addSection = async (title: string, icon?: string) => {
    try {
      const newSection = await $fetch<Section>('/api/sections', {
        method: 'POST',
        body: { title, icon }
      })
      sections.value.push(newSection)
      return newSection
    } catch (e) {
      error.value = e as Error
      throw e
    }
  }

  // Mettre � jour une section
  const updateSection = async (section: Section) => {
    try {
      const updated = await $fetch<Section>('/api/sections', {
        method: 'PUT',
        body: section
      })
      const index = sections.value.findIndex(s => s.id === section.id)
      if (index !== -1) {
        sections.value[index] = updated
      }
      return updated
    } catch (e) {
      error.value = e as Error
      throw e
    }
  }

  // Supprimer une section
  const deleteSection = async (id: string) => {
    try {
      await $fetch(`/api/sections?id=${id}`, { method: 'DELETE' })
      sections.value = sections.value.filter(s => s.id !== id)
    } catch (e) {
      error.value = e as Error
      throw e
    }
  }

  // R�organiser les sections
  const reorderSections = async (order: string[]) => {
    try {
      await $fetch('/api/sections', {
        method: 'PATCH',
        body: { order }
      })
      sections.value.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id))
    } catch (e) {
      error.value = e as Error
      throw e
    }
  }

  // Ajouter un lien
  const addLink = async (sectionId: string, link: Omit<Link, 'id'>) => {
    try {
      const newLink = await $fetch<Link>('/api/links', {
        method: 'POST',
        body: { sectionId, ...link }
      })
      const section = sections.value.find(s => s.id === sectionId)
      if (section) {
        if (!section.links) section.links = []
        section.links.push(newLink)
      }
      return newLink
    } catch (e) {
      error.value = e as Error
      throw e
    }
  }

  // Mettre � jour un lien
  const updateLink = async (link: Link) => {
    try {
      const updated = await $fetch<Link>('/api/links', {
        method: 'PUT',
        body: link
      })

      for (const section of sections.value) {
        const index = section.links?.findIndex(l => l.id === link.id)
        if (index !== undefined && index !== -1 && section.links) {
          section.links[index] = updated
          break
        }
      }
      return updated
    } catch (e) {
      error.value = e as Error
      throw e
    }
  }

  // Supprimer un lien
  const deleteLink = async (id: string) => {
    try {
      await $fetch(`/api/links?id=${id}`, { method: 'DELETE' })

      for (const section of sections.value) {
        if (section.links) {
          section.links = section.links.filter(l => l.id !== id)
        }
      }
    } catch (e) {
      error.value = e as Error
      throw e
    }
  }

  // R�organiser les liens dans une section
  const reorderLinks = async (sectionId: string, order: string[]) => {
    try {
      await $fetch('/api/links', {
        method: 'PATCH',
        body: { sectionId, order }
      })

      const section = sections.value.find(s => s.id === sectionId)
      if (section && section.links) {
        section.links.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id))
      }
    } catch (e) {
      error.value = e as Error
      throw e
    }
  }

  // Ajouter un widget
  const addWidget = async (sectionId: string, widget: Omit<Widget, 'id'>) => {
    try {
      const newWidget = await $fetch<Widget>('/api/widgets', {
        method: 'POST',
        body: { sectionId, ...widget }
      })
      const section = sections.value.find(s => s.id === sectionId)
      if (section) {
        if (!section.widgets) section.widgets = []
        section.widgets.push(newWidget)
      }
      return newWidget
    } catch (e) {
      error.value = e as Error
      throw e
    }
  }

  // Supprimer un widget
  const deleteWidget = async (widgetId: string) => {
    try {
      await $fetch(`/api/widgets?id=${widgetId}`, { method: 'DELETE' })

      for (const section of sections.value) {
        if (section.widgets) {
          section.widgets = section.widgets.filter(w => w.id !== widgetId)
        }
      }
    } catch (e) {
      error.value = e as Error
      throw e
    }
  }

  return {
    // State
    settings,
    sections,
    isLoading,
    error,

    // Actions
    loadSettings,
    loadSections,
    addSection,
    updateSection,
    deleteSection,
    reorderSections,
    addLink,
    updateLink,
    deleteLink,
    reorderLinks,
    addWidget,
    deleteWidget
  }
}
