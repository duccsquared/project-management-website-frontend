<template>
  <component
    :is="tag"
    v-bind="tagAttrs"
    :aria-label="ariaLabel"
    :class="classes"
    @click="handleClick"
  >
    <slot />
  </component>
</template>

<script setup>
import { computed, resolveComponent } from 'vue'
import { cva } from 'class-variance-authority';
import { cn } from '~/utils/cn'

const props = defineProps({
  level: {
    type: Number,
    default: 1
  },
  // Renders as NuxtLink when set (internal route) - takes priority over href.
  to: {
    type: [String, Object],
    default: undefined
  },
  // Renders as a plain <a> when set (external link).
  href: {
    type: String,
    default: undefined
  },
  // Optional accessible name for clickable/link cards (no visible text,
  // e.g. icon-only cards). Recommended when to/href is used.
  ariaLabel: {
    type: String,
    default: undefined
  },
  class: {
    type: String,
    default: ''
  },
})

// True when the card navigates somewhere (as opposed to a plain @click card).
const isLink = computed(() => !!props.to || !!props.href)

// Polymorphic root: NuxtLink for internal routes, <a> for external links,
// plain <section> otherwise. Each needs different attrs.
const tag = computed(() => {
  if (props.to) return resolveComponent('NuxtLink')
  if (props.href) return 'a'
  return 'section'
})

const tagAttrs = computed(() => {
  if (props.to) return { to: props.to }
  if (props.href) return { href: props.href }
  return {}
})

const classes = computed(() =>
  cn(
    cardVariants({ level: props.level }),
    // Cards that navigate should communicate they're interactive; plain
    // @click cards can add cursor-pointer themselves via the class prop.
    isLink.value ? 'cursor-pointer' : '',
    props.class
  )
)

const cardVariants = cva(
  `p-6 rounded-card border border-border`,
  {
    variants: {
      level: {
        0: 'bg-surface-0',
        1: 'bg-surface-1',
        2: 'bg-surface-2',
        3: 'bg-surface-3',
        4: 'bg-surface-4',
        5: 'bg-surface-5'
      },
    },
    defaultVariants: {
      level: 1,
    },
  }
)

// Emits
const emit = defineEmits(['click'])

// Card is only "disabled" (non-interactive) when it's a plain <section> —
// <a>/NuxtLink have no disabled state, so for clicks we let the consumer
// guard via their own handler/`disabled` nav checks.
const handleClick = (event) => {
  emit('click', event)
}
</script>