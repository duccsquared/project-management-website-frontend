<template>
  <div class="max-w-dashboard mx-auto">
    <div class="size-8 dark:size-12 bg-red-800 dark:bg-red-200"></div>
    <!-- Page header -->
    <div class="flex items-start justify-between gap-4 flex-wrap">
      <div>
        <h1 class="text-page-title font-page-title text-text-strong">Your projects</h1>
        <p class="text-body font-body text-text-muted mt-1">
          Four active workstreams across the team this quarter.
        </p>
      </div>
      <div class="flex items-center gap-2">
        <AppButton icon="lucide:pencil" variant="primary" size="md">Primary</AppButton>
        <AppButton icon="lucide:pencil" variant="primary" size="md" :disabled="true">disabled</AppButton>
        <button
          @click="modalOpen = true"
          class="flex items-center gap-2 px-4 py-2 rounded-input text-secondary font-secondary text-white bg-primary hover:bg-primary-hover transition-colors duration-hover ease-out"
        >
          <svg class="w-icon-small h-icon-small" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Extra Button
        </button>
        <button
          @click="simulateError"
          class="px-4 py-2 rounded-input text-secondary font-secondary text-text border border-border hover:bg-surface-3 transition-colors duration-hover ease-out"
        >
          Simulate error
        </button>
        <button
          @click="modalOpen = true"
          class="flex items-center gap-2 px-4 py-2 rounded-input text-secondary font-secondary text-white bg-primary hover:bg-primary-hover transition-colors duration-hover ease-out"
        >
          <svg class="w-icon-small h-icon-small" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New project
        </button>
      </div>
    </div>

    <!-- Summary strip: elevated card (surface-3) -->
    <section class="mt-8 p-5 rounded-card bg-surface-3 border border-border-strong shadow-card">
      <h2 class="text-section-title font-section-title text-text-strong">This week at a glance</h2>
      <div class="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="p-4 rounded-input bg-surface-1 border border-border-subtle">
          <p class="text-caption font-caption text-text-subtle">Total projects</p>
          <p class="text-page-title font-page-title text-text-strong mt-1">{{ summary.total }}</p>
        </div>
        <div class="p-4 rounded-input bg-surface-1 border border-border-subtle">
          <p class="text-caption font-caption text-text-subtle">On track</p>
          <p class="text-page-title font-page-title text-success-text mt-1">{{ summary.onTrack }}</p>
        </div>
        <div class="p-4 rounded-input bg-surface-1 border border-border-subtle">
          <p class="text-caption font-caption text-text-subtle">At risk</p>
          <p class="text-page-title font-page-title text-danger-text mt-1">{{ summary.atRisk }}</p>
        </div>
      </div>
    </section>

    <!-- Project cards -->
    <section class="mt-8">
      <h2 class="text-section-title font-section-title text-text-strong mb-4">Active workstreams</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        <ProjectCard v-for="project in projects" :key="project.id" :project="project" />
      </div>
    </section>

    <!-- Type scale reference (for design QA) -->
    <section class="mt-10 p-6 rounded-card bg-surface-2 border border-border">
      <h2 class="text-section-title font-section-title text-text-strong mb-4">Type scale reference</h2>
      <div class="space-y-3">
        <p class="text-page-title font-page-title text-text-strong">Page title — 36 / bold</p>
        <p class="text-section-title font-section-title text-text-strong">Section title — 24 / semibold</p>
        <p class="text-card-title font-card-title text-text-strong">Card title — 20 / semibold</p>
        <p class="text-heading font-heading text-text-strong">Heading — 18 / medium</p>
        <p class="text-body font-body text-text">Body — 16 / regular, used for standard paragraph copy.</p>
        <p class="text-secondary font-secondary text-text-muted">Secondary — 14 / regular, for supporting detail.</p>
        <p class="text-caption font-caption text-text-subtle">CAPTION — 12 / medium, for labels and metadata</p>
      </div>
    </section>

    <!-- Disabled state reference -->
    <section class="mt-8 p-6 rounded-card bg-surface-2 border border-border">
      <h2 class="text-section-title font-section-title text-text-strong mb-4">States</h2>
      <div class="flex flex-wrap items-center gap-3">
        <button class="px-4 py-2 rounded-input text-secondary font-secondary text-white bg-primary hover:bg-primary-hover transition-colors duration-hover ease-out">
          Enabled button
        </button>
        <button disabled class="px-4 py-2 rounded-input text-secondary font-secondary bg-surface-disabled text-text-disabled cursor-not-allowed">
          Disabled button
        </button>
        <input
          disabled
          placeholder="Disabled input"
          class="px-3 py-2 rounded-input text-secondary font-secondary bg-surface-disabled text-text-disabled border border-border-disabled cursor-not-allowed"
        />
      </div>
    </section>

    <section class="mt-8 p-6 rounded-card bg-surface-2 border border-border">
      <h2 class="text-section-title font-section-title text-text-strong mb-4">States</h2>
      <div class="flex flex-wrap items-center gap-3">
        <AppButton icon="lucide:pencil" variant="primary" size="md">Primary</AppButton>
        <AppButton icon="lucide:pencil" variant="secondary" size="md">Secondary</AppButton>
        <AppButton icon="lucide:pencil" variant="outline" size="md">Outline</AppButton>
        <AppButton icon="lucide:pencil" variant="ghost" size="md">Ghost</AppButton>
        <AppButton icon="lucide:pencil" variant="danger" size="md">Danger</AppButton>

        <AppButton icon="lucide:pencil" variant="primary" size="md"></AppButton>
        <AppButton icon="lucide:pencil" variant="secondary" size="md"></AppButton>
        <AppButton icon="lucide:pencil" variant="outline" size="md"></AppButton>
        <AppButton icon="lucide:pencil" variant="ghost" size="md"></AppButton>
        <AppButton icon="lucide:pencil" variant="danger" size="md"></AppButton>

        <AppButton icon="lucide:pencil" variant="primary" size="md" :loading="true"></AppButton>
        <AppButton iconRight="lucide:pencil" variant="primary" size="md">Primary</AppButton>
        
        <AppButton icon="lucide:pencil" variant="primary" size="md" :disabled="true">Primary</AppButton>
        <AppButton icon="lucide:pencil" variant="secondary" size="md" :disabled="true">Secondary</AppButton>
        <AppButton icon="lucide:pencil" variant="outline" size="md" :disabled="true">Outline</AppButton>
        <AppButton icon="lucide:pencil" variant="ghost" size="md" :disabled="true">Ghost</AppButton>
        <AppButton icon="lucide:pencil" variant="danger" size="md" :disabled="true">Danger</AppButton>

      </div>
      <div class="flex flex-wrap items-center gap-3 mt-4">
        <AppInput v-model="email" label="Email" type="email" required hint="We'll never share this" />
        <AppInput v-model="search" label="Search" clearable placeholder="Search…" />
        <AppInput v-model="password" label="Password" type="password" error="Must be 8+ characters" />
        <AppTextarea v-model="bio" label="Bio" :rows="4" :maxlength="280" auto-resize />
      </div>
      <div class="flex flex-wrap items-center gap-3 mt-4">
        <AppCheckbox v-model="agreed" label="I agree to the terms" required />
        <AppCheckbox v-model="apple" value="apple" label="Apple" disabled/>
        <AppCheckbox v-model="banana" value="banana" label="Banana" indeterminate/>

        <AppRadioGroup v-model="plan" label="Choose a plan" required>
          <AppRadio value="free" label="Free" />
          <AppRadio value="pro" label="Pro" />
        </AppRadioGroup>
      </div>
    </section>

    <!-- Modal and Toast Stack -->
    <NewProjectModal :open="modalOpen" @close="modalOpen = false" @create="handleCreateProject" />
  </div>
</template>
<script setup>
import useNotification from '~/composables/useNotification'
const { showSuccess, showError } = useNotification();

// definePageMeta({
//   layout: 'base'
// })
const activeNav = ref('projects')
const modalOpen = ref(false)

const projects = ref([
  {
    id: 1,
    name: 'Northwind redesign',
    description: 'Refresh the checkout flow and mobile nav for the spring release.',
    status: 'on-track',
    progress: 68,
    team: ['MK', 'JT', 'RS'],
    dueDate: 'Aug 14',
  },
  {
    id: 2,
    name: 'Billing migration',
    description: 'Move legacy invoices to the new metered billing engine.',
    status: 'at-risk',
    progress: 34,
    team: ['JT', 'AL'],
    dueDate: 'Aug 2',
  },
  {
    id: 3,
    name: 'Onboarding v2',
    description: 'Interactive product tour for new workspace admins.',
    status: 'planning',
    progress: 12,
    team: ['RS', 'MK', 'AL', 'JT'],
    dueDate: 'Sep 5',
  },
  {
    id: 4,
    name: 'Design system audit',
    description: 'Reconcile token usage across the marketing site and app shell.',
    status: 'on-track',
    progress: 81,
    team: ['MK'],
    dueDate: 'Aug 9',
  },
])

function handleCreateProject({ name, description }) {
  projects.value.unshift({
    id: Date.now(),
    name,
    description: description || 'No description yet.',
    status: 'planning',
    progress: 0,
    team: ['MK'],
    dueDate: 'TBD',
  })
  modalOpen.value = false
  showSuccess('Project created', `"${name}" was added to your workspace.`)
}

function simulateError() {
  showError('Sync failed', 'Could not reach the billing service. Retrying shortly.')
}

const summary = computed(() => ({
  total: projects.value.length,
  onTrack: projects.value.filter(p => p.status === 'on-track').length,
  atRisk: projects.value.filter(p => p.status === 'at-risk').length,
}))

const email = ref('');
const search = ref('');
const password = ref('');
const bio = ref('');

const agreed = ref(false)
const apple = ref(false)
const banana = ref(false)
const plan = ref('free')
</script>
