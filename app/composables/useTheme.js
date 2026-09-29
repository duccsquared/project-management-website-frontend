export const useTheme = () => {
  const isDark = useState('isDark', () => false)

  const applyTheme = () => {
    if (import.meta.client) {
      document.documentElement.classList.toggle('dark', isDark.value)
    }
  }

  const toggle = () => {
    isDark.value = !isDark.value
    applyTheme()
  }

  const initTheme = () => {
    if (import.meta.client) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      isDark.value = prefersDark
      applyTheme()
    }
  }

  return { isDark, toggle, initTheme }
}
