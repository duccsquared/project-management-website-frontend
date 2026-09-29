<template>
    <section :class="classes">
        <slot/>
    </section>
</template>
<script setup>
import { computed } from 'vue'
import { cva } from 'class-variance-authority';
import { cn } from '~/utils/cn'

const props = defineProps({
  level: {
    type: Number,
    default: 1
  },
  class: {
    type: String,
    default: ''
  },
})

const classes = computed(() =>
  cn(
    cardVariants({ level: props.level }),
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
</script>