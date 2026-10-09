<template>
  <aside
    class="hidden md:flex md:flex-col shrink-0 bg-surface-1 border-r border-border transition-[background-color,border-color,width] duration-sidebar ease-out"
    :class="collapsed ? 'w-16' : 'w-64'"
  >
    <!-- Brand -->
    <div
      class="h-16 flex items-center gap-2 px-5 border-b border-border-subtle"
      :class="collapsed ? 'justify-center px-0' : ''"
    >
      <div class="w-8 h-8 rounded-control bg-primary flex items-center justify-center shrink-0">
        <Icon icon="lucide:hop" class="w-icon-small h-icon-small shrink-0 text-white"></Icon>
      </div>
      <span v-if="!collapsed" class="text-heading font-heading text-text-strong whitespace-nowrap">Taskflow</span>
    </div>

    <!-- Nav -->
    <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
      <template v-for="item in tabItems" :key="item.id">
        <!-- Parent item -->
        <button
          @click="onParentSelect(item)"
          :title="collapsed ? item.name : undefined"
          class="w-full flex items-center gap-3 px-3 py-2 rounded-input text-secondary font-secondary transition-colors duration-hover ease-out"
          :class="parentClass(item)"
        >
          <Icon :icon="item.icon" class="w-icon-normal h-icon-normal shrink-0"></Icon>
          <span v-if="!collapsed" class="flex-1 text-left whitespace-nowrap">{{ item.name }}</span>
          <Icon
            v-if="!collapsed && item.subTabs?.length"
            :icon="isOpen(item.id) ? 'lucide:chevron-down' : 'lucide:chevron-right'"
            class="w-icon-small h-icon-small shrink-0 text-text-muted"
          ></Icon>
        </button>

        <!-- Subtabs -->
        <div
          v-if="!collapsed && item.subTabs?.length && isOpen(item.id)"
          class="ml-4 mt-1 space-y-1 border-l border-border pl-3"
        >
          <button
            v-for="sub in item.subTabs"
            :key="sub.id"
            @click="onSelect(sub)"
            class="w-full flex items-center gap-3 px-2 py-1.5 rounded-input text-caption font-caption transition-colors duration-hover ease-out"
            :class="activeItem === sub.id
              ? 'bg-primary-subtle text-primary-text'
              : 'text-text-muted hover:bg-surface-3 hover:text-text-strong'"
          >
            <Icon :icon="sub.icon" class="w-icon-small h-icon-small shrink-0"></Icon>
            <span class="flex-1 text-left whitespace-nowrap">{{ sub.name }}</span>
          </button>
        </div>
      </template>
    </nav>

    <!-- Bottom controls -->
    <div class="p-4 border-t border-border-subtle space-y-2">
      <!-- Plan pill (expanded only) -->
      <div
        v-if="!collapsed"
        class="flex items-center justify-between px-3 py-2 rounded-input bg-surface-3 whitespace-nowrap"
      >
        <span class="text-caption font-caption text-text-muted">Team plan</span>
        <span class="text-caption font-caption px-2 py-0.5 rounded-pill bg-secondary-subtle text-secondary-text">Pro</span>
      </div>
    </div>
  </aside>
</template>
<script setup>
import { Icon } from '@iconify/vue'
import { useRouter } from 'vue-router';
import { useSidebar } from '../composables/useSidebar';
const router = useRouter();
const { collapsed, toggleCollapsed } = useSidebar();

const activeItem = ref('home');
const openTabs = ref(new Set(['category']));
const emit = defineEmits(['select'])

const isOpen = (id) => openTabs.value.has(id);

const toggleOpen = (item) => {
  const next = new Set(openTabs.value);
  if (next.has(item.id)) next.delete(item.id);
  else next.add(item.id);
  openTabs.value = next;
};

// Parent click: expand/collapse subtabs when present, otherwise navigate.
const onParentSelect = (item) => {
  if (item.subTabs?.length) {
    if(collapsed.value) {
      // if collapsed, uncollapse and open sidebar (if closed)
      collapsed.value = false;
      if(!(new Set(openTabs.value)).has(item.id)) {
        toggleOpen(item);
      }
      
    }
    else {
      toggleOpen(item);
    }
    return;
  }
  onSelect(item);
};

const onSelect = (tab) => {
  emit('select', tab.id);
  activeItem.value = tab.id;
  router.push(tab.link);
};

const parentClass = (item) => {
  const isActive = item.subTabs?.some((s) => s.id === activeItem.value) || activeItem.value === item.id;
  return isActive
    ? 'bg-primary-subtle text-primary-text'
    : 'text-text-muted hover:bg-surface-3 hover:text-text-strong';
};

const tabItems = reactive([
    {
        id: "home",
        name: "Home",
        icon: "lucide:home",
        link: "/"
    },
    {
        id: "projects",
        name: "Projects",
        icon: "lucide:clipboard-list",
        link: "/projects"
    },
    {
        id: "tasks",
        name: "Tasks",
        icon: "lucide:list-checks",
        link: "/"
    },
    {
        id: "settings",
        name: "Settings",
        icon: "lucide:settings",
        link: "/"
    },
    {
        id: "test",
        name: "Test",
        icon: "lucide:flask-conical",
        link: "/testPage"
    },
    {
        id: "category",
        name: "Category",
        icon: "lucide:clipboard-list",
        subTabs: [
          {
            id: "subtab1",
            name: "Subtab 1",
            icon: "lucide:sun",
            link: "/"
          },
          {
            id: "subtab2",
            name: "Subtab 2",
            icon: "lucide:moon",
            link: "/"
          }
        ]
    },
])
</script>
