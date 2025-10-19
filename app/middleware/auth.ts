export default defineNuxtRouteMiddleware((to, from) => {
  // Vérifier uniquement côté client
  if (process.client) {
    const isAuth = localStorage.getItem('adminAuthenticated') === 'true'

    // Si pas authentifié et on essaie d'accéder à admin
    if (!isAuth && to.path === '/admin') {
      // Initialiser l'état du composable
      const { isAuthenticated } = useAuth()
      isAuthenticated.value = false
    }
  }
})
