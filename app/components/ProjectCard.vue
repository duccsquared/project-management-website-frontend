<template>
  <article
    class="group p-5 rounded-card bg-surface-2 border border-border shadow-card hover:shadow-dropdown hover:-translate-y-0.5 transition-[transform,box-shadow] duration-hover ease-out cursor-pointer"
  >
    <div class="flex items-start justify-between">
      <h3 class="text-card-title font-card-title text-text-strong">{{ project.name }}</h3>
      <span
        class="text-caption font-caption px-2.5 py-1 rounded-pill shrink-0"
        :class="[statusStyles[project.status].bg, statusStyles[project.status].text]"
      >
        {{ statusStyles[project.status].label }}
      </span>
    </div>

    <p class="text-secondary font-secondary text-text-muted mt-1.5">{{ project.description }}</p>

    <!-- progress -->
    <div class="mt-4">
      <div class="flex items-center justify-between mb-1.5">
        <span class="text-caption font-caption text-text-subtle">Progress</span>
        <span class="text-caption font-caption text-text-muted">{{ project.progress }}%</span>
      </div>
      <div class="h-1.5 rounded-full bg-surface-4 overflow-hidden">
        <div
          class="h-full rounded-full bg-primary transition-[width] duration-modal ease-out"
          :style="{ width: project.progress + '%' }"
        />
      </div>
    </div>

    <!-- footer -->
    <div class="mt-4 flex items-center justify-between pt-4 border-t border-border-subtle">
      <div class="flex -space-x-2">
        <div
          v-for="(initial, i) in project.team"
          :key="i"
          class="w-7 h-7 rounded-full bg-surface-4 border-2 border-surface-2 flex items-center justify-center text-caption font-caption text-text-muted"
        >
          {{ initial }}
        </div>
      </div>
      <div class="flex items-center gap-1.5 text-text-subtle">
        <svg class="w-icon-small h-icon-small" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span class="text-caption font-caption">{{ project.dueDate }}</span>
      </div>
    </div>
  </article>
</template>
<script setup>
const props = defineProps({
  project: { type: Object, required: true }
})

const statusStyles = {
  'on-track': { bg: 'bg-success-subtle', text: 'text-success-text', label: 'On track' },
  'at-risk': { bg: 'bg-danger-subtle', text: 'text-danger-text', label: 'At risk' },
  'planning': { bg: 'bg-secondary-subtle', text: 'text-secondary-text', label: 'Planning' },
}
</script>