<template>
  <div class="w-full">
    <label v-if="label" :for="fieldId" class="mb-1.5 block text-secondary font-medium text-text-strong">
      {{ label }}
      <span v-if="required" class="text-danger" aria-hidden="true">*</span>
    </label>

    <div :class="shellClass">
      <span v-if="slots.leadingIcon" class="flex shrink-0 items-center text-text-muted">
        <slot name="leadingIcon" />
      </span>

      <input
        :id="fieldId"
        ref="inputRef"
        :type="resolvedType"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :aria-describedby="describedBy"
        :aria-invalid="ariaInvalid"
        v-bind="restAttrs"
        :class="[
          'min-w-0 flex-1 bg-transparent text-text-strong outline-none placeholder:text-text-subtle disabled:cursor-not-allowed disabled:text-text-disabled',
          currentSize.text,
        ]"
        @input="onInput"
        @focus="emit('focus', $event)"
        @blur="emit('blur', $event)"
      />

      <button
        v-if="showClearButton"
        type="button"
        class="flex shrink-0 items-center text-text-muted transition-colors duration-hover ease-out hover:text-text-strong"
        aria-label="Clear input"
        @click="handleClear"
      >
        <Icon icon="lucide:x" :class="currentSize.icon" />
      </button>

      <button
        v-else-if="isPassword"
        type="button"
        class="flex shrink-0 items-center text-text-muted transition-colors duration-hover ease-out hover:text-text-strong"
        :aria-label="showPassword ? 'Hide password' : 'Show password'"
        :aria-pressed="showPassword"
        @click="showPassword = !showPassword"
      >
        <Icon :icon="showPassword ? 'lucide:eye-off' : 'lucide:eye'" :class="currentSize.icon" />
      </button>

      <span v-else-if="slots.trailingIcon" class="flex shrink-0 items-center text-text-muted">
        <slot name="trailingIcon" />
      </span>
    </div>

    <p v-if="error" :id="errorId" class="mt-1.5 text-caption text-danger" role="alert">
      {{ error }}
    </p>
    <p v-else-if="hint" :id="hintId" class="mt-1.5 text-caption text-text-muted">
      {{ hint }}
    </p>
  </div>
</template>
<script setup>
import { computed, ref, useAttrs } from 'vue'
import { Icon } from '@iconify/vue'
import { useFormField } from '~/composables/useFormField'
import { cn } from '~/utils/cn'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  // Text-like input types only. Checkbox/radio/file/range not supported
  type: {
    type: String,
    default: 'text',
    validator: (v) =>
      ['text', 'email', 'password', 'number', 'tel', 'url', 'search', 'date', 'time', 'datetime-local', 'month', 'week'].includes(v),
  },
  id: { type: String, default: undefined },
  label: { type: String, default: undefined },
  hint: { type: String, default: undefined },
  error: { type: String, default: undefined },
  placeholder: { type: String, default: undefined },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  size: { type: String, default: 'md', validator: (v) => ['sm', 'md', 'lg'].includes(v) },
  // Adds an inline clear ("x") button once there's a value. 
  // Ignored for type="password", which uses its trailing slot for the reveal toggle.
  clearable: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'blur', 'focus', 'clear'])

const slots = defineSlots()
const attrs = useAttrs()
const { fieldId, hintId, errorId, describedBy, ariaInvalid } = useFormField(props)

const inputRef = ref(null)
const showPassword = ref(false)

const isPassword = computed(() => props.type === 'password')
const resolvedType = computed(() => (isPassword.value ? (showPassword.value ? 'text' : 'password') : props.type))
const showClearButton = computed(
  () => props.clearable && !isPassword.value && !props.disabled && !props.readonly && String(props.modelValue ?? '').length > 0
)

const sizeStyles = {
  sm: { shell: 'h-8 gap-1.5 px-2.5', text: 'text-secondary', icon: 'h-icon-small w-icon-small' },
  md: { shell: 'h-10 gap-2 px-3', text: 'font-body', icon: 'h-icon-normal w-icon-normal' },
  lg: { shell: 'h-12 gap-2 px-4', text: 'text-heading', icon: 'h-icon-large w-icon-large' },
}
const currentSize = computed(() => sizeStyles[props.size])

const shellClass = computed(() =>
  cn(
    'flex w-full items-center rounded-input border bg-surface-1 transition-colors duration-hover ease-out',
    currentSize.value.shell,
    props.disabled
      ? 'cursor-not-allowed border-border-disabled bg-surface-3'
      : props.error
        ? 'border-danger focus-within:border-danger focus-within:ring-2 focus-within:ring-danger focus-within:ring-offset-2 focus-within:ring-offset-surface-1'
        : 'border-border hover:border-border-strong focus-within:border-primary focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 focus-within:ring-offset-surface-1',
    attrs.class
  )
)

const restAttrs = computed(() => {
  const { class: _class, ...rest } = attrs
  return rest
})

function onInput(event) {
  emit('update:modelValue', event.target.value)
}

function handleClear() {
  emit('update:modelValue', '')
  emit('clear')
  inputRef.value?.focus()
}

defineExpose({ focus: () => inputRef.value?.focus() })
</script>
