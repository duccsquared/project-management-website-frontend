export default defineNuxtRouteMiddleware((to, from) => {
  if (process.client) {
    if (sessionStorage.getItem("authToken") == null || sessionStorage.getItem("user") == null) {
      if (to.path !== '/login') {
        return navigateTo('/login')
      }
    }

  }
})