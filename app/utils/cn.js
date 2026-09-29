import { extendTailwindMerge } from 'tailwind-merge';

// Fixes twMerge only recognizing base Tailwind CSS classes
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'text-color': [
        {
          text: [
            'text', 'text-strong', 'text-muted', 'text-subtle', 'text-disabled',
          ],
        },
      ],
    },
  },
})


/**
 * Merge class values (strings, arrays, falsy values) and resolve
 * conflicting Tailwind utilities so the last one wins.
 *
 * @param {...(string|string[]|false|null|undefined)} inputs
 * @returns {string}
 */
export function cn(...inputs) {
  return twMerge(
    inputs
      .flat()
      .filter(Boolean)
      .join(' ')
  )
}