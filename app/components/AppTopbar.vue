<template>
  <header class="h-16 shrink-0 flex items-center justify-between px-6 bg-surface-1 border-b border-border transition-colors duration-sidebar ease-out">
    <div class="flex items-center gap-3">
      <!-- sidebar collapse toggle -->
      <button
        @click="toggleCollapsed"
        class="w-9 h-9 rounded-control flex items-center justify-center text-text-muted hover:bg-surface-3 hover:text-text-strong transition-colors duration-hover ease-out"
        :title="collapsed ? 'Expand sidebar' : 'Collapse sidebar'"
        :aria-label="collapsed ? 'Expand sidebar' : 'Collapse sidebar'"
      >
        <Icon
          :icon="collapsed ? 'lucide:panel-left-open' : 'lucide:panel-left-close'"
          class="w-icon-normal h-icon-normal"
        />
      </button>
      <!-- <h1 class="text-card-title font-card-title text-text-strong">Projects</h1> -->
    </div>

    <div class="flex items-center gap-3">
      <!-- theme toggle -->
      <button
        @click="toggle"
        class="w-9 h-9 rounded-control flex items-center justify-center text-text-muted hover:bg-surface-3 hover:text-text-strong transition-colors duration-hover ease-out"
        :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
      >
        <Icon v-if="!isDark" icon="lucide:sun" class="w-icon-normal h-icon-normal"/>
        <Icon v-else icon="lucide:moon" class="w-icon-normal h-icon-normal"/>
      </button>

      <!-- user dropdown -->
      <div class="relative" ref="dropdownRef">
        <button
          @click="dropdownOpen = !dropdownOpen"
          class="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-input hover:bg-surface-3 transition-colors duration-hover ease-out"
        >
          <div class="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-white text-caption font-caption">
            {{ userInitials }}
          </div>
          <Icon icon="lucide:chevron-down" class="w-icon-small h-icon-small text-text-muted"/>
        </button>

        <Transition
          enter-active-class="transition duration-hover ease-out"
          enter-from-class="opacity-0 scale-95 -translate-y-1"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition duration-hover ease-out"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-if="dropdownOpen"
            class="absolute right-0 mt-2 w-56 rounded-card bg-surface-4 border border-border shadow-dropdown py-1 z-20"
          >
            <div class="px-3 py-2 border-b border-border-subtle">
              <p class="text-secondary font-secondary text-text-strong">{{ user.email }}</p>
              <p class="text-caption font-caption text-text-muted">{{ user.name }}</p>
            </div>
            <button class="w-full text-left px-3 py-2 text-secondary font-secondary text-text hover:bg-surface-5 transition-colors duration-hover ease-out">
              Account settings
            </button>
            <!-- <button class="w-full text-left px-3 py-2 text-secondary font-secondary text-text hover:bg-surface-5 transition-colors duration-hover ease-out">
              Billing
            </button> -->
            <button @click="signOut" class="w-full text-left px-3 py-2 text-secondary font-secondary text-danger-text hover:bg-danger-subtle transition-colors duration-hover ease-out">
              Sign out
            </button>
          </div>
        </Transition>
      </div>
    </div>
  </header>
</template>
<script setup>
import { Icon } from '@iconify/vue'
import { useRouter } from 'vue-router';
import { useSidebar } from '../composables/useSidebar';
import { useErrorWrapper } from '~/composables/useErrorWrapper';
import { useApi } from '~/composables/useApi';
const { isDark, toggle } = useTheme()
const { collapsed, toggleCollapsed } = useSidebar();
const router = useRouter();

const user = ref({});
const dropdownOpen = ref(false)
const dropdownRef = ref(null)

const userInitials = computed(() => {
  if (user.value.name) {
    const names = user.value.name.split(' ')
    return names.map(n => n[0]).join('').toUpperCase()
  }
  return ''
})

function handleClickOutside(e) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    dropdownOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside))

const signOut = () => {
  sessionStorage.setItem("authToken",null)
  router.push("/login")
}

onMounted(() => {
  fetchData();
})

const fetchData = useErrorWrapper(async () => {
  user.value = JSON.parse(sessionStorage.getItem("user"));
  console.log(sessionStorage)
})
</script>