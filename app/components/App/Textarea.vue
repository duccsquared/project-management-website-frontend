<template>
  <div class="w-full">
    <label v-if="label" :for="fieldId" class="mb-1.5 block text-secondary font-medium text-text-strong">
      {{ label }}
      <span v-if="required" class="text-danger" aria-hidden="true">*</span>
    </label>

    <textarea
      :id="fieldId"
      ref="textareaRef"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :required="required"
      :rows="rows"
      :maxlength="maxlength"
      :aria-describedby="describedBy"
      :aria-invalid="ariaInvalid"
      v-bind="restAttrs"
      :class="[
        shellClass,
        resizeClass,
        currentSize.text,
        'block text-text-strong outline-none placeholder:text-text-subtle disabled:cursor-not-allowed disabled:text-text-disabled',
      ]"
      @input="onInput"
      @focus="emit('focus', $event)"
      @blur="emit('blur', $event)"
    />

    <div v-if="error || hint || maxlength !== undefined" class="mt-1.5 flex items-start justify-between gap-2">
      <p v-if="error" :id="errorId" class="text-caption text-danger" role="alert">
        {{ error }}
      </p>
      <p v-else-if="hint" :id="hintId" class="text-caption text-text-muted">
        {{ hint }}
      </p>
      <span v-else />

      <span v-if="maxlength !== undefined" class="shrink-0 text-caption text-text-subtle tabular-nums">
        {{ modelValue.length }}/{{ maxlength }}
      </span>
    </div>
  </div>
</template>
<script setup>
import { computed, nextTick, ref, useAttrs, watch } from 'vue'
import { useFormField } from '~/composables/useFormField'
import { cn } from '~/utils/cn'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  modelValue: { type: String, default: '' },
  id: { type: String, default: undefined },
  label: { type: String, default: undefined },
  hint: { type: String, default: undefined },
  error: { type: String, default: undefined },
  placeholder: { type: String, default: undefined },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  size: { type: String, default: 'md', validator: (v) => ['sm', 'md', 'lg'].includes(v) },
  rows: { type: Number, default: 3 },
  maxlength: { type: Number, default: undefined },
  // Grows with content instead of scrolling internally. Forces resize
  // handling off, since the two behaviors conflict.
  autoResize: { type: Boolean, default: false },
  resize: { type: String, default: 'none', validator: (v) => ['none', 'y'].includes(v) },
})

const emit = defineEmits(['update:modelValue', 'blur', 'focus'])

const attrs = useAttrs()
const { fieldId, hintId, errorId, describedBy, ariaInvalid } = useFormField(props)

const textareaRef = ref(null)

const sizeStyles = {
  sm: { pad: 'px-2.5 py-1.5', text: 'text-secondary' },
  md: { pad: 'px-3 py-2', text: 'font-body' },
  lg: { pad: 'px-4 py-2.5', text: 'text-heading' },
}
const currentSize = computed(() => sizeStyles[props.size])

const shellClass = computed(() =>
  cn(
    'w-full rounded-input border bg-surface-1 transition-colors duration-hover ease-out',
    currentSize.value.pad,
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

const resizeClass = computed(() => (props.autoResize ? 'resize-none' : props.resize === 'y' ? 'resize-y' : 'resize-none'))

function resize() {
  const el = textareaRef.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = `${el.scrollHeight}px`
}

function onInput(event) {
  emit('update:modelValue', event.target.value)
  if (props.autoResize) resize()
}

if (props.autoResize) {
  watch(
    () => props.modelValue,
    () => nextTick(resize),
    { immediate: true }
  )
}

defineExpose({ focus: () => textareaRef.value?.focus() })
</script>