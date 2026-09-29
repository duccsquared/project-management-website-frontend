<template>
  <Transition
    enter-active-class="transition duration-modal ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-modal ease-out"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="props.open"
      class="fixed inset-0 z-40 flex items-center justify-center bg-text-strong/40 backdrop-blur-[2px] px-4"
      @click.self="emit('close')"
    >
      <Transition
        enter-active-class="transition duration-modal ease-out"
        enter-from-class="opacity-0 scale-95 translate-y-2"
        enter-to-class="opacity-100 scale-100 translate-y-0"
        leave-active-class="transition duration-modal ease-out"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div
          v-if="props.open"
          class="w-full max-w-md rounded-modal bg-surface-2 border border-border shadow-modal p-6"
        >
          <h2 class="text-section-title font-section-title text-text-strong">New project</h2>
          <p class="text-secondary font-secondary text-text-muted mt-1">
            Give it a name your team will recognize at a glance.
          </p>

          <div class="mt-5 space-y-4">
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

          <div class="mt-6 flex justify-end gap-2">
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
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
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