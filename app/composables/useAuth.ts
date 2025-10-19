export const useAuth = () => {
  const isAuthenticated = useState('isAuthenticated', () => false)

  // Restaurer l'état depuis localStorage côté client
  const initAuth = () => {
    if (process.client) {
      const stored = localStorage.getItem('adminAuthenticated')
      if (stored === 'true') {
        isAuthenticated.value = true
      }
    }
  }

  const login = async (password: string) => {
    try {
      const result = await $fetch<{ success: boolean }>('/api/auth/login', {
        method: 'POST',
        body: { password }
      })

      if (result.success) {
        isAuthenticated.value = true
        // Persister dans localStorage
        if (process.client) {
          localStorage.setItem('adminAuthenticated', 'true')
        }
        return true
      }
      return false
    } catch (e) {
      return false
    }
  }

  const logout = () => {
    isAuthenticated.value = false
    // Supprimer de localStorage
    if (process.client) {
      localStorage.removeItem('adminAuthenticated')
    }
  }

  return {
    isAuthenticated,
    login,
    logout,
    initAuth
  }
}
