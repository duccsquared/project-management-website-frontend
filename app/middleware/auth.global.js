export default defineNuxtRouteMiddleware((to, from) => {
  if (process.client) {
    console.log(sessionStorage.getItem("authToken"), sessionStorage.getItem("user"))
    if (sessionStorage.getItem("authToken") != null && sessionStorage.getItem("user") != null) {
      return abortNavigation()
    }
    if (to.path !== '/login') {
      return navigateTo('/login')
    }
  }
})