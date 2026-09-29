<template>
  <fieldset
    role="radiogroup"
    class="m-0 w-full border-0 p-0"
    :aria-describedby="describedBy"
    :aria-invalid="error ? 'true' : undefined"
    :aria-required="required || undefined"
  >
    <legend v-if="label" class="mb-1.5 block p-0 text-secondary font-medium text-text-strong">
      {{ label }}
      <span v-if="required" class="text-danger" aria-hidden="true">*</span>
    </legend>

    <div :class="['flex', direction === 'horizontal' ? 'flex-row flex-wrap gap-x-6 gap-y-2' : 'flex-col gap-2']">
      <slot />
    </div>

    <p v-if="error" :id="errorId" class="mt-1.5 text-caption text-danger" role="alert">{{ error }}</p>
    <p v-else-if="hint" :id="hintId" class="mt-1.5 text-caption text-text-muted">{{ hint }}</p>
  </fieldset>
</template>
<script setup>
import { computed, provide, useId } from 'vue'

const props = defineProps({
  modelValue: { type: [String, Number], default: undefined },
  label: { type: String, default: undefined },
  hint: { type: String, default: undefined },
  error: { type: String, default: undefined },
  disabled: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  size: { type: String, default: 'md', validator: (v) => ['sm', 'md', 'lg'].includes(v) },
  direction: { type: String, default: 'vertical', validator: (v) => ['vertical', 'horizontal'].includes(v) },
})

const emit = defineEmits(['update:modelValue'])

// One id namespaces both the shared `name` (so the native radios act as a
// single group) and the hint/error ids for the group's aria-describedby.
const groupId = useId()
const name = `radio-group-${groupId}`
const hintId = `${groupId}-hint`
const errorId = `${groupId}-error`

const describedBy = computed(() => {
  if (props.error) return errorId
  if (props.hint) return hintId
  return undefined
})

// Individual Radio components inject this rather than each re-declaring
// modelValue/name/size/disabled/error as props — those all live on the
// group, not the option.
provide('radioGroup', {
  name,
  modelValue: computed(() => props.modelValue),
  size: computed(() => props.size),
  disabled: computed(() => props.disabled),
  error: computed(() => props.error),
  update: (value) => emit('update:modelValue', value),
})
</script>