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
      class="fixed inset-0 z-40 overflow-y-auto bg-text-strong/40 backdrop-blur-[2px] px-4"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="titleId"
      :aria-describedby="descriptionId"
    >
      <!-- Full-height flex wrapper: centers the modal when it fits and lets
           the whole overlay scroll when content is taller than the viewport
           (min-h-full keeps the top reachable while scrolling). Clicks on the
           wrapper -- i.e. the area outside the card -- close the modal. -->
      <div class="flex min-h-full items-center justify-center py-8" @click.self="requestClose">
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
            class="rounded-modal bg-surface-2 border border-border shadow-modal p-6"
            :class="`${classes}`"
          >
            <!-- Optional header, self-contained: icon, title, sub, close btn -->
            <div v-if="props.title || $slots.subtitle || $slots.footer || $slots.icon || $slots.actions" class="flex items-start gap-3">
              <div v-if="$slots.icon" class="flex shrink-0 items-center text-text-muted">
                <slot name="icon" />
              </div>
              <div class="min-w-0 flex-1">
                <h2 :id="titleId" class="text-section-title font-section-title text-text-strong">
                  {{ props.title }}
                </h2>
                <div
                  v-if="$slots.subtitle"
                  :id="descriptionId"
                  class="text-secondary font-secondary text-text-muted mt-1"
                >
                  <slot name="subtitle" />
                </div>
              </div>
              <!-- Close button sits in the header by default (it's also how
                   dismissible works), but only when the header is rendered. -->
              <button
                v-if="props.dismissible"
                type="button"
                :aria-label="props.closeLabel"
                class="flex shrink-0 size-8 items-center justify-center rounded-control text-text-muted transition-colors duration-hover ease-out hover:bg-surface-3 hover:text-text-strong"
                @click="requestClose"
              >
                <Icon icon="lucide:x" class="w-icon-normal h-icon-normal" />
              </button>
            </div>

            <!-- Body: whatever the consumer needs - form fields, rows, copy -->
            <div
              class="mt-5"
              :id="descriptionId"
              :class="props.title || $slots.subtitle ? 'text-body font-body text-text-muted' : ''"
            >
              <slot />
            </div>

            <!-- Optional footer/actions bar (e.g. Cancel / Confirm buttons) -->
            <div v-if="$slots.footer" class="mt-6 flex justify-end gap-2">
              <slot name="footer" />
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </Transition>
</template>
<script setup>
import { useId } from 'vue'
import { Icon } from '@iconify/vue'
import { cn } from '~/utils/cn'

const props = defineProps({
  open: { type: Boolean, default: false },
  // Header title (optional — a bare body-only modal is fine without one)
  title: { type: String, default: undefined },
  // Accessibility description, also rendered as a standard sub-line when
  // the `subtitle` slot is not used explicitly.
  description: { type: String, default: undefined },
  // Show the "x" close button in the header
  dismissible: { type: Boolean, default: true },
  // Accessible name for the close button
  closeLabel: { type: String, default: 'Close' },
  // Card width — a theme.width token (xl, 2xl, forms, settings, dashboard...)
  width: { type: String, default: 'xl' },
})
const emit = defineEmits(['close'])

// Unique ids so aria-labelledby / aria-describedby reliably resolve.
const modalId = useId()
const titleId = `${modalId}-title`
const descriptionId = `${modalId}-description`

const classes = computed(() =>
  cn(
    'w-full max-w-xl',  
    props.width, 
  
  )
)

function requestClose() {
  if (props.open) emit('close')
}
</script>