import { computed, nextTick, reactive, ref, watch } from 'vue'

/**
 * Form state + validation, built around a Zod schema.
 *
 * Validation runs continuously against the whole schema (so cross-field
 * rules like `.refine()` on a confirm-password field work correctly), but
 * errors are only *surfaced* per-field once that field has been touched
 * (blurred) or the form has been submitted at least once — so a user isn't
 * shown "required" errors on fields they haven't reached yet.
 *
 * @param {import('zod').ZodType} schema
 * @param {object} initialValues
 */
export function useForm(schema, initialValues = {}) {
  const values = reactive({ ...initialValues })
  const errors = reactive({}) // always current, regardless of visibility
  const touched = reactive({})
  const submitCount = ref(0)
  const isSubmitting = ref(false)

  function runValidation() {
    const result = schema.safeParse(values)

    for (const key of Object.keys(errors)) delete errors[key]

    if (!result.success) {
      for (const issue of result.error.issues) {
        const key = issue.path.join('.')
        // First issue per field wins — showing one message at a time reads
        // better than stacking every failed rule for that field.
        if (!(key in errors)) errors[key] = issue.message
      }
    }

    return result.success
  }

  // Keep `errors` continuously in sync as the user types. Visibility is
  // handled separately (see errorFor / visibleErrors) so this can run
  // freely without flashing errors at fields the user hasn't reached yet.
  watch(values, runValidation, { deep: true, immediate: true })

  const isValid = computed(() => Object.keys(errors).length === 0)

  // Errors gated for a top-level summary — only meaningful after a submit
  // attempt, since showing every unfinished field's error before that
  // point would be noise.
  const visibleErrors = computed(() => (submitCount.value > 0 ? { ...errors } : {}))

  function errorFor(field) {
    return touched[field] || submitCount.value > 0 ? errors[field] : undefined
  }

  /**
   * Spread this onto a field component:
   *   <AppInput v-bind="form.bind('email')" label="Email" />
   * Covers v-model, error display, blur-triggered touch, and a `name`
   * attribute (used for focus-on-invalid-submit).
   */
  function bind(field) {
    return {
      modelValue: values[field],
      'onUpdate:modelValue': (value) => {
        values[field] = value
      },
      error: errorFor(field),
      name: field,
      onBlur: () => {
        touched[field] = true
      },
    }
  }

  function touchAll() {
    for (const key of Object.keys(values)) touched[key] = true
  }

  async function focusFirstError() {
    await nextTick()
    const firstField = Object.keys(errors)[0]
    if (!firstField) return
    // Works for any field whose native control carries a matching `name`
    // (Input/Textarea/Checkbox get this via bind()'s attrs fallthrough).
    // Grouped widgets like RadioGroup manage their own internal `name` and
    // won't be reachable this way — acceptable for now, flagged as a
    // known limitation rather than solved here.
    const el = document.querySelector(`[name="${firstField}"]`)
    el?.focus?.()
  }

  /**
   * Wrap your submit logic: <AppForm @submit="form.handleSubmit(onValid)">
   * `onValid` receives a plain (non-reactive) snapshot of the values.
   */
  function handleSubmit(onValid, onInvalid) {
    return async (event) => {
      event?.preventDefault?.()
      submitCount.value++
      touchAll()

      const valid = runValidation()
      if (!valid) {
        await focusFirstError()
        onInvalid?.({ ...errors })
        return
      }

      isSubmitting.value = true
      try {
        await onValid({ ...values })
      } finally {
        isSubmitting.value = false
      }
    }
  }

  function reset(newValues = initialValues) {
    for (const key of Object.keys(values)) delete values[key]
    Object.assign(values, newValues)
    for (const key of Object.keys(touched)) delete touched[key]
    submitCount.value = 0
    runValidation()
  }

  return {
    values,
    errors,
    visibleErrors,
    touched,
    submitCount,
    isSubmitting,
    isValid,
    bind,
    errorFor,
    handleSubmit,
    reset,
    validate: runValidation,
  }
}