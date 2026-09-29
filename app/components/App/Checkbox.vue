<template>
  <div :class="cn('w-full', attrs.class)">
    <label
      :for="fieldId"
      :class="['inline-flex items-start gap-2', disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer']"
    >
      <span class="relative flex shrink-0 items-center justify-center">
        <!-- Visually hidden but focusable/checkable — this is the real
             control. The span below is purely decorative (aria-hidden). -->
        <input
          :id="fieldId"
          ref="inputRef"
          type="checkbox"
          class="peer sr-only"
          :checked="isChecked"
          :disabled="disabled"
          :required="required"
          :aria-describedby="describedBy"
          :aria-invalid="ariaInvalid"
          v-bind="restAttrs"
          @change="onChange"
        />
        <span
          aria-hidden="true"
          :class="[
            currentSize.box,
            'flex items-center justify-center rounded-md border text-white transition-colors duration-hover ease-out',
            'peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-surface-1',
            error ? 'peer-focus-visible:ring-danger' : 'peer-focus-visible:ring-primary',
            disabled
              ? 'border-border-disabled bg-surface-3'
              : error
                ? (isChecked || indeterminate ? 'border-danger bg-danger' : 'border-border bg-surface-1')
                : (isChecked || indeterminate ? 'border-primary bg-primary' : 'border-border bg-surface-1 peer-hover:border-border-strong'),
          ]"
        >
          <Icon v-if="indeterminate" icon="lucide:minus" :class="currentSize.icon" />
          <Icon v-else-if="isChecked" icon="lucide:check" :class="currentSize.icon" />
        </span>
      </span>

      <span v-if="label || $slots.default" :class="['text-text-strong', currentSize.text]">
        <slot>{{ label }}</slot>
        <span v-if="required" class="text-danger" aria-hidden="true">*</span>
      </span>
    </label>

    <p v-if="error" :id="errorId" class="mt-1.5 text-caption text-danger" role="alert">{{ error }}</p>
    <p v-else-if="hint" :id="hintId" class="mt-1.5 text-caption text-text-muted">{{ hint }}</p>
  </div>
</template>
<script setup>
import { computed, ref, useAttrs, watchEffect } from 'vue'
import { Icon } from '@iconify/vue'
import { useFormField } from '~/composables/useFormField'
import { cn } from '~/utils/cn'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  // Boolean for a standalone checkbox. Bind the same array across several
  // Checkboxes (with distinct `value`s) to get group/multi-select behavior
  // for free — Vue's v-model already handles array membership toggling.
  modelValue: { type: [Boolean, Array], default: false },
  value: { type: [String, Number, Object], default: undefined },
  id: { type: String, default: undefined },
  label: { type: String, default: undefined },
  hint: { type: String, default: undefined },
  error: { type: String, default: undefined },
  disabled: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  // "Some but not all" state — a DOM property, not a reflected attribute,
  // so it's applied imperatively via a template ref below.
  indeterminate: { type: Boolean, default: false },
  size: { type: String, default: 'md', validator: (v) => ['sm', 'md', 'lg'].includes(v) },
})

const emit = defineEmits(['update:modelValue'])

const attrs = useAttrs()
const { fieldId, hintId, errorId, describedBy, ariaInvalid } = useFormField(props)

const inputRef = ref(null)
const isGroup = computed(() => Array.isArray(props.modelValue))

const isChecked = computed(() => (isGroup.value ? props.modelValue.includes(props.value) : !!props.modelValue))

function onChange(event) {
  const checked = event.target.checked

  if (!isGroup.value) {
    emit('update:modelValue', checked)
    return
  }

  const next = [...props.modelValue]
  const index = next.indexOf(props.value)
  if (checked && index === -1) next.push(props.value)
  if (!checked && index !== -1) next.splice(index, 1)
  emit('update:modelValue', next)
}

watchEffect(() => {
  if (inputRef.value) inputRef.value.indeterminate = props.indeterminate
})

const sizeStyles = {
  sm: { box: 'h-4 w-4', icon: 'h-icon-small w-icon-small', text: 'text-secondary font-secondary' },
  md: { box: 'h-5 w-5', icon: 'h-icon-small w-icon-small', text: 'text-body font-body' },
  lg: { box: 'h-6 w-6', icon: 'h-icon-normal w-icon-normal', text: 'text-heading font-heading' },
}
const currentSize = computed(() => sizeStyles[props.size])

const restAttrs = computed(() => {
  const { class: _class, ...rest } = attrs
  return rest
})
</script>