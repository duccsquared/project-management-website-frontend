<template>
  <AppModal :open="open" title="New project" dismissible @close="emit('close')">
    <template #subtitle>Give it a name your team will recognize at a glance.</template>

    <div class="space-y-4">
      <div>
        <label class="block text-caption font-caption text-text-muted mb-1.5">Project name</label>
        <input
          v-model="name"
          type="text"
          placeholder="e.g. Northwind redesign"
          class="w-full px-3 py-2 rounded-input bg-surface-1 border border-border text-body font-body text-text-strong placeholder:text-text-subtle focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface-2 transition-shadow duration-hover ease-out"
        />
      </div>
      <div>
        <label class="block text-caption font-caption text-text-muted mb-1.5">Description (optional)</label>
        <textarea
          v-model="description"
          rows="3"
          placeholder="What's this project about?"
          class="w-full px-3 py-2 rounded-input bg-surface-1 border border-border text-body font-body text-text-strong placeholder:text-text-subtle focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface-2 transition-shadow duration-hover ease-out resize-none"
        />
      </div>
    </div>

    <template #footer>
      <button
        @click="emit('close')"
        class="px-4 py-2 rounded-input text-secondary font-secondary text-text hover:bg-surface-3 active:duration-press transition-colors duration-hover ease-out"
      >
        Cancel
      </button>
      <button
        @click="submit"
        :disabled="!name.trim()"
        class="px-4 py-2 rounded-input text-secondary font-secondary text-white transition-colors duration-hover ease-out"
        :class="name.trim()
          ? 'bg-primary hover:bg-primary-hover active:duration-press'
          : 'bg-surface-disabled text-text-disabled cursor-not-allowed'"
      >
        Create project
      </button>
    </template>
  </AppModal>
</template>
<script setup>
const props = defineProps({
  open: { type: Boolean, default: false }
})
const emit = defineEmits(['close', 'create'])

const name = ref('')
const description = ref('')

function submit() {
  if (!name.value.trim()) return
  emit('create', { name: name.value, description: description.value })
  name.value = ''
  description.value = ''
}
</script>