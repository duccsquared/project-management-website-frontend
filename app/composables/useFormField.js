import { computed, useId } from 'vue'

/**
 * Shared label / hint / error / aria wiring for form controls.
 *
 * Keeping this in a composable (rather than a <FormField> wrapper) means
 * Input.vue and Textarea.vue each stay a single self-contained element
 * instead of needing to be wrapped by a second component every time
 * they're used.
 *
 * @param {object} props - the component's reactive props object
 *   (props.id, props.hint, props.error are read)
 */
export function useFormField(props) {
  // useId() is SSR-safe (stable across server render + client hydration),
  // unlike Math.random() or a module-level counter.
  const generatedId = useId()
  const fieldId = computed(() => props.id || generatedId)

  const hintId = computed(() => `${fieldId.value}-hint`)
  const errorId = computed(() => `${fieldId.value}-error`)

  // Error takes precedence over hint — only one is visible at a time,
  // so only one should be wired into aria-describedby.
  const describedBy = computed(() => {
    if (props.error) return errorId.value
    if (props.hint) return hintId.value
    return undefined
  })

  const ariaInvalid = computed(() => (props.error ? 'true' : undefined))

  return { fieldId, hintId, errorId, describedBy, ariaInvalid }
}