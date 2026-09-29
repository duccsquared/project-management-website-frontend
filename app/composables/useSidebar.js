export const useSidebar = () => {
  const collapsed = useState('sidebarCollapsed', () => false)

  const toggleCollapsed = () => {
    collapsed.value = !collapsed.value
  }

  return { collapsed, toggleCollapsed }
}