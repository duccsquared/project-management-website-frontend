<template>
  <component
    :is="tag"
    v-bind="tagAttrs"
    :aria-busy="loading"
    :aria-label="ariaLabel"
    :aria-disabled="isDisabled ? 'true' : undefined"
    :class="classes"
    @click="handleClick"
  >
    <Icon
      v-if="loading"
      icon="lucide:loader-circle"
      class="animate-spin h-icon-small w-icon-small"
    />
    <Icon
      v-else-if="icon"
      :icon="icon"
      class="h-icon-small w-icon-small"
    />
    <slot />
    <Icon
      v-if="iconRight && !loading"
      :icon="iconRight"
      class="h-icon-small w-icon-small"
    />
  </component>
</template>

<script setup>
import { computed, useSlots, resolveComponent } from 'vue'
import { cva } from 'class-variance-authority';
import { Icon } from "@iconify/vue";
import { cn } from '~/utils/cn'
const slots = useSlots();

const props = defineProps({
  icon: {
    type: String,
    default: ''
  },
  iconRight: {
    type: String,
    default: ''
  },
  variant: {
    type: String,
    default: 'primary'
  },
  size: {
    type: String,
    default: 'md'
  },
  type: {
    type: String,
    default: 'button'
  },
  loading: {
    type: Boolean,
    default: false
  },
  class: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
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
  // Required for icon-only buttons (no default slot content) so
  // screen readers have something to announce. Optional otherwise.
  ariaLabel: {
    type: String,
    default: undefined
  }
})

// True when the button has no visible text, i.e. icon-only.
// Used to tighten padding/gap so icon buttons aren't lopsided.
const isIconOnly = computed(() => !slots.default && (props.icon || props.iconRight))

// Disabled state includes loading and, for link variants, 
// blocks navigation even though <a>/NuxtLink have no native disabled attr.
const isDisabled = computed(() => props.disabled || props.loading)

// Polymorphic root: NuxtLink for internal routes, 
// <a> for external links, plain <button> otherwise.
// Each needs different attrs;
// native disabled only exists on <button>, and only <button> takes type="submit".
const tag = computed(() => {
  if (props.to) return resolveComponent('NuxtLink')
  if (props.href) return 'a'
  return 'button'
})

const tagAttrs = computed(() => {
  if (props.to) {
    // NuxtLink has no disabled state; when disabled, fall back to a
    // real button-like non-navigating element instead of a dead link.
    return isDisabled.value
      ? { tabindex: -1 }
      : { to: props.to }
  }
  if (props.href) {
    return isDisabled.value
      ? { tabindex: -1 }
      : { href: props.href }
  }
  return { type: props.type, disabled: isDisabled.value }
})

const buttonVariants = cva(
  `inline-flex items-center justify-center gap-2 rounded-control font-body duration-hover text-text
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-0
  active:scale-[0.98] active:translate-y-[1px]
  disabled:text-text-disabled disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0 disabled:scale-100`,
  {
    variants: {
      variant: {
        primary: "bg-primary-600 hover:bg-primary-700 text-white disabled:bg-surface-disabled dark:bg-primary-400 dark:hover:bg-primary-300",
        secondary: "bg-secondary-600 hover:bg-secondary-700 text-white disabled:bg-surface-disabled dark:bg-secondary-400 dark:hover:bg-secondary-300",
        outline: "border border-border-strong hover:bg-surface-3 disabled:border-border-disabled text-text bg-surface-1",
        ghost: "hover:bg-surface-3 text-text disabled:bg-transparent",
        danger: "bg-danger-600 hover:bg-danger-700 text-white disabled:bg-surface-disabled dark:bg-danger-400 dark:hover:bg-danger-300",
        success: "bg-success-600 hover:bg-success-700 text-white disabled:bg-surface-disabled dark:bg-success-400 dark:hover:bg-success-300",
      },
      size: {
        // regular
        sm: "h-9 px-3", // text-secondary
        md: "h-10 px-4", // text-body
        lg: "h-12 px-6", // text-heading
        // compact variants: no fixed height/padding, useful for ghost
        // buttons inline with text or icon-only buttons in tight spaces
        csm: "text-secondary",
        cmd: "text-body",
        clg: "text-heading",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

// Merge variant classes with any consumer-supplied override classes
const classes = computed(() =>
  cn(
    buttonVariants({ variant: props.variant, size: props.size }),
    isIconOnly.value ? 'px-2.5' : '',
    // <a>/NuxtLink have no native disabled attribute, so Tailwind's
    // disabled:* variants never fire on them. Apply the same look
    // manually via aria-disabled, which we set in tagAttrs above.
    isDisabled.value && tag.value !== 'button'
      ? 'aria-disabled:opacity-50 aria-disabled:cursor-not-allowed aria-disabled:pointer-events-none'
      : '',
    props.class
  )
)

// Emits
const emit = defineEmits(['click'])

// Guards against double-submit from a fast double-click/double-Enter
// before loading has a chance to flip reactively (e.g. an async
// handler that sets loading itself, one tick after the first click).
let isHandlingClick = false

const handleClick = (event) => {
  if (isDisabled.value || isHandlingClick) return
  isHandlingClick = true
  emit('click', event)
  // Release on next tick rather than leaving it locked forever -
  // callers are expected to flip loading themselves for anything
  // actually async; this guard only covers the same-tick double-fire.
  Promise.resolve().then(() => {
    isHandlingClick = false
  })
}
</script>