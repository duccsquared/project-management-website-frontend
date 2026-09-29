<template>
  <div class="w-full overflow-hidden rounded-card border border-border-subtle shadow-card bg-surface-2">
    <div class="overflow-x-auto">
      <table class="w-full border-collapse">
        <thead
          :class="[
            'bg-surface-3',
            stickyHeader && 'sticky top-0 z-10',
          ]"
        >
          <tr>
            <th v-if="selectable" class="w-12 px-4 py-3 border-b border-border-subtle">
              <input
                type="checkbox"
                class="h-4 w-4 rounded-control border-border-strong text-primary focus:ring-2 focus:ring-offset-2"
                :checked="allOnPageSelected"
                :indeterminate="someOnPageSelected"
                @change="toggleAllOnPage"
                aria-label="Select all rows on this page"
              />
            </th>

            <th
              v-for="column in columns"
              :key="column.key"
              scope="col"
              :style="column.width ? { width: column.width } : undefined"
              :class="[
                'px-4 py-3 border-b border-border-subtle text-secondary font-secondary select-none',
                alignClass(column.align),
              ]"
            >
              <slot :name="`header-${column.key}`" :column="column">
                <button
                  v-if="column.sortable"
                  type="button"
                  class="inline-flex items-center gap-1 text-secondary font-secondary hover:text-text-strong transition-colors duration-hover"
                  @click="toggleSort(column)"
                >
                  <span>{{ column.label }}</span>
                  <Icon
                    :icon="
                      activeSort?.key === column.key
                        ? activeSort.direction === 'asc'
                          ? 'lucide:arrow-up'
                          : 'lucide:arrow-down'
                        : 'lucide:arrow-up-down'
                    "
                    class="w-icon-small h-icon-small flex-shrink-0"
                    :class="activeSort?.key === column.key ? 'text-primary' : 'text-text-subtle'"
                  />
                </button>
                <span v-else>{{ column.label }}</span>
              </slot>
            </th>
          </tr>
        </thead>

        <tbody>
          <!-- loading skeleton -->
          <template v-if="loading">
            <tr v-for="i in loadingRows" :key="`skeleton-${i}`" class="border-b border-border-subtle last:border-b-0">
              <td v-if="selectable" class="px-4 py-3">
                <div class="h-4 w-4 rounded-control bg-surface-4 animate-pulse" />
              </td>
              <td v-for="column in columns" :key="column.key" class="px-4 py-3">
                <div class="h-4 rounded-control bg-surface-4 animate-pulse" style="max-width: 12rem" />
              </td>
            </tr>
          </template>

          <!-- empty state -->
          <tr v-else-if="pagedRows.length === 0">
            <td :colspan="columns.length + (selectable ? 1 : 0)" class="px-4 py-16">
              <div class="flex flex-col items-center justify-center gap-2 text-center">
                <Icon icon="lucide:inbox" class="w-icon-hero h-icon-hero text-text-subtle" />
                <p class="text-heading font-heading text-text-strong">{{ emptyTitle }}</p>
                <p class="text-secondary font-secondary text-text-muted max-w-forms">{{ emptyMessage }}</p>
              </div>
            </td>
          </tr>

          <!-- data rows -->
          <template v-else>
            <tr
              v-for="row in pagedRows"
              :key="row[rowKey]"
              class="border-b border-border-subtle last:border-b-0 transition-colors duration-hover hover:bg-surface-4"
              :class="[
                striped && pagedRows.indexOf(row) % 2 === 1 && 'bg-surface-1',
                selectedKeys.has(row[rowKey]) && 'bg-primary-subtle hover:bg-primary-subtle',
              ]"
              @click="emit('row-click', row)"
            >
              <td v-if="selectable" class="w-12 px-4 py-3" @click.stop>
                <input
                  type="checkbox"
                  class="h-4 w-4 rounded-control border-border-strong text-primary focus:ring-2 focus:ring-offset-2"
                  :checked="selectedKeys.has(row[rowKey])"
                  @change="toggleRow(row)"
                  :aria-label="`Select row ${row[rowKey]}`"
                />
              </td>

              <td
                v-for="column in columns"
                :key="column.key"
                :class="['px-4 py-3 text-body font-body text-text', alignClass(column.align)]"
              >
                <slot :name="`cell-${column.key}`" :row="row" :column="column" :value="cellValue(column, row)">
                  {{ cellValue(column, row) }}
                </slot>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <!-- pagination footer -->
    <div
      v-if="isPaginated && pagedRows.length > 0"
      class="flex items-center justify-between px-4 py-3 border-t border-border-subtle bg-surface-2"
    >
      <p class="text-secondary font-secondary text-text-muted">
        Page {{ internalPage }} of {{ pageCount }} · {{ effectiveTotal }} total
      </p>
      <div class="flex items-center gap-2">
        <button
          type="button"
          class="inline-flex items-center justify-center w-8 h-8 rounded-control border border-border text-text hover:bg-surface-4 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-hover"
          :disabled="internalPage <= 1"
          @click="goToPage(internalPage - 1)"
          aria-label="Previous page"
        >
          <Icon icon="lucide:chevron-left" class="w-icon-small h-icon-small" />
        </button>
        <button
          type="button"
          class="inline-flex items-center justify-center w-8 h-8 rounded-control border border-border text-text hover:bg-surface-4 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-hover"
          :disabled="internalPage >= pageCount"
          @click="goToPage(internalPage + 1)"
          aria-label="Next page"
        >
          <Icon icon="lucide:chevron-right" class="w-icon-small h-icon-small" />
        </button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'

/**
 * Table.vue — hybrid config/slot data table
 *
 * Structure & behavior (sortable, width, align, formatting) come from the
 * `columns` config array. Custom cell markup is opted into per-column via
 * dynamic slots named `cell-{key}` (and `header-{key}` for custom headers).
 *
 * Example:
 * <Table :columns="columns" :rows="rows" row-key="id" selectable striped>
 *   <template #cell-status="{ row }">
 *     <StatusBadge :status="row.status" />
 *   </template>
 * </Table>
 */

const props = defineProps({
  /**
   * [{ key, label, sortable = false, align = 'left', width, format }]
   * `format(value, row)` — optional plain-text formatter, used when no
   * cell-{key} slot is provided.
   */
  columns: { type: Array, required: true },
  rows: { type: Array, required: true },
  rowKey: { type: String, default: 'id' },

  loading: { type: Boolean, default: false },
  loadingRows: { type: Number, default: 6 },

  selectable: { type: Boolean, default: false },
  selected: { type: Array, default: () => [] }, // v-model:selected

  striped: { type: Boolean, default: false },
  stickyHeader: { type: Boolean, default: false },

  emptyTitle: { type: String, default: 'No data yet' },
  emptyMessage: { type: String, default: 'Nothing to show here right now.' },

  // Sorting — component manages state internally unless you pass `sort`
  // (controlled mode), in which case you own it via @sort.
  sort: { type: Object, default: null }, // { key, direction: 'asc' | 'desc' }
  defaultSort: { type: Object, default: null },

  // Pagination — omit `page`/`pageSize` for a single unpaginated page.
  page: { type: Number, default: null },
  pageSize: { type: Number, default: 10 },
  total: { type: Number, default: null }, // pass when paginating server-side
})

const emit = defineEmits(['update:selected', 'update:sort', 'update:page', 'sort', 'row-click'])

/* ---------------------------------- sort --------------------------------- */

const internalSort = ref(props.defaultSort ?? null)
const activeSort = computed(() => props.sort ?? internalSort.value)

function toggleSort(column) {
  if (!column.sortable) return
  const current = activeSort.value
  let next
  if (!current || current.key !== column.key) {
    next = { key: column.key, direction: 'asc' }
  } else if (current.direction === 'asc') {
    next = { key: column.key, direction: 'desc' }
  } else {
    next = null // third click clears sort
  }
  internalSort.value = next
  emit('update:sort', next)
  emit('sort', next)
}

const sortedRows = computed(() => {
  const s = activeSort.value
  if (!s) return props.rows
  const col = props.columns.find((c) => c.key === s.key)
  const dir = s.direction === 'desc' ? -1 : 1
  return [...props.rows].sort((a, b) => {
    const av = col?.sortValue ? col.sortValue(a) : a[s.key]
    const bv = col?.sortValue ? col.sortValue(b) : b[s.key]
    if (av == null && bv == null) return 0
    if (av == null) return 1
    if (bv == null) return -1
    if (av < bv) return -1 * dir
    if (av > bv) return 1 * dir
    return 0
  })
})

/* -------------------------------- pagination ------------------------------ */

const isPaginated = computed(() => props.page !== null)
const internalPage = ref(props.page ?? 1)
watch(() => props.page, (p) => { if (p !== null) internalPage.value = p })

const effectiveTotal = computed(() => props.total ?? sortedRows.value.length)
const pageCount = computed(() => Math.max(1, Math.ceil(effectiveTotal.value / props.pageSize)))

const pagedRows = computed(() => {
  if (!isPaginated.value) return sortedRows.value
  // If `total` is provided, assume rows are already the current page (server-side).
  if (props.total !== null) return sortedRows.value
  const start = (internalPage.value - 1) * props.pageSize
  return sortedRows.value.slice(start, start + props.pageSize)
})

function goToPage(p) {
  const clamped = Math.min(Math.max(1, p), pageCount.value)
  internalPage.value = clamped
  emit('update:page', clamped)
}

/* -------------------------------- selection -------------------------------- */

const selectedKeys = computed(() => new Set(props.selected))

const allOnPageSelected = computed(() =>
  pagedRows.value.length > 0 && pagedRows.value.every((r) => selectedKeys.value.has(r[props.rowKey]))
)
const someOnPageSelected = computed(() =>
  pagedRows.value.some((r) => selectedKeys.value.has(r[props.rowKey])) && !allOnPageSelected.value
)

function toggleRow(row) {
  const key = row[props.rowKey]
  const next = new Set(props.selected)
  next.has(key) ? next.delete(key) : next.add(key)
  emit('update:selected', [...next])
}

function toggleAllOnPage() {
  const next = new Set(props.selected)
  if (allOnPageSelected.value) {
    pagedRows.value.forEach((r) => next.delete(r[props.rowKey]))
  } else {
    pagedRows.value.forEach((r) => next.add(r[props.rowKey]))
  }
  emit('update:selected', [...next])
}

/* --------------------------------- helpers --------------------------------- */

const alignClass = (align) => ({ left: 'text-left', center: 'text-center', right: 'text-right' }[align ?? 'left'])

function cellValue(column, row) {
  const raw = column.value ? column.value(row) : row[column.key]
  return column.format ? column.format(raw, row) : raw
}
</script>