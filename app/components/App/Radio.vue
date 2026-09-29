<template>
  <label :class="cn('inline-flex items-center gap-2', isDisabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer', attrs.class)">
    <span class="relative flex shrink-0 items-center justify-center">
      <input
        type="radio"
        class="peer sr-only"
        :name="group?.name"
        :value="value"
        :checked="isChecked"
        :disabled="isDisabled"
        v-bind="restAttrs"
        @change="onChange"
      />
      <span
        aria-hidden="true"
        :class="[
          currentSize.outer,
          'flex items-center justify-center rounded-full border bg-surface-1 transition-colors duration-hover ease-out',
          'peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-surface-1',
          hasError ? 'peer-focus-visible:ring-danger' : 'peer-focus-visible:ring-primary',
          isDisabled
            ? 'border-border-disabled bg-surface-3'
            : hasError
              ? 'border-danger'
              : isChecked
                ? 'border-primary'
                : 'border-border peer-hover:border-border-strong',
        ]"
      >
        <span
          v-if="isChecked"
          :class="[currentSize.inner, 'rounded-full', isDisabled ? 'bg-text-disabled' : hasError ? 'bg-danger' : 'bg-primary']"
        />
      </span>
    </span>

    <span v-if="label || $slots.default" :class="['text-text-strong', currentSize.text]">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>
<script setup>
import { computed, inject, useAttrs } from 'vue'
import { cn } from '~/utils/cn'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  value: { type: [String, Number], required: true },
  label: { type: String, default: undefined },
  // Per-option override — the group can still disable everything at once.
  disabled: { type: Boolean, default: false },
})

const attrs = useAttrs()
const group = inject('radioGroup', null)

if (!group && import.meta.dev) {
  console.warn('[Radio] must be used inside a <RadioGroup>.')
}

const isChecked = computed(() => group?.modelValue.value === props.value)
const isDisabled = computed(() => props.disabled || !!group?.disabled.value)
const hasError = computed(() => !!group?.error.value)
const size = computed(() => group?.size.value ?? 'md')

const sizeStyles = {
  sm: { outer: 'h-4 w-4', inner: 'h-1.5 w-1.5', text: 'text-secondary font-secondary' },
  md: { outer: 'h-5 w-5', inner: 'h-2 w-2', text: 'text-body font-body' },
  lg: { outer: 'h-6 w-6', inner: 'h-2.5 w-2.5', text: 'text-heading font-heading' },
}
const currentSize = computed(() => sizeStyles[size.value])

const restAttrs = computed(() => {
  const { class: _class, ...rest } = attrs
  return rest
})

function onChange() {
  group?.update(props.value)
}
</script>