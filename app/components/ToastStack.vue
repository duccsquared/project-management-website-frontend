

<template>
  <div class="fixed bottom-6 right-6 z-50 flex flex-col gap-2 w-80">
    <TransitionGroup
      enter-active-class="transition duration-toast ease-out"
      enter-from-class="opacity-0 translate-x-4"
      enter-to-class="opacity-100 translate-x-0"
      leave-active-class="transition duration-toast ease-out absolute"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
      move-class="transition duration-toast ease-out"
    >
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="flex items-start gap-3 p-4 rounded-card border shadow-dropdown bg-surface-3"
        :class="[variantStyles[toast.variant].bg, variantStyles[toast.variant].border]"
      >
        <Icon :icon="variantStyles[toast.variant].icon" class="shrink-0 mt-0.5" :class="variantStyles[toast.variant].color"/>
        <div class="flex-1">
          <p class="text-secondary font-secondary text-text-strong">{{ toast.title }}</p>
          <p class="text-caption font-caption text-text-muted mt-0.5">{{ toast.body }}</p>
        </div>
        <button
          @click="removeNotif(toast.id)"
          class="text-text-subtle hover:text-text-strong transition-colors duration-hover ease-out"
        >
          <svg class="w-icon-small h-icon-small" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import useNotification from '~/composables/useNotification';
import { Icon } from "@iconify/vue";

const { notifications, removeNotif } = useNotification();
const toasts = ref([])

watch(notifications, (newVal) => {
  console.log("Updating", newVal)
  toasts.value = newVal
}, { deep: true })

// const props = defineProps({
//   toasts: { type: Array, required: true }
// })

// const emit = defineEmits(['dismiss'])

const variantStyles = {
  success: { bg: 'bg-success-subtle', border: 'border-success/20', text: 'text-success-text', icon: 'lucide:circle-check', color: 'text-success' },
  danger: { bg: 'bg-danger-subtle', border: 'border-danger/20', text: 'text-danger-text', icon: 'lucide:circle-x', color: 'text-danger'},
}
</script>