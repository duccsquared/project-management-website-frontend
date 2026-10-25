<template>
  <AppModal :open="open" :title="`${task?.name}`" dismissible @close="emit('close')">
    <template #subtitle>{{ task?.description }}</template>
    <div v-if="task!=null" class="flex flex-col gap-4 p-4" >
      <div class="flex flex-row justify-between">
         <p class="font-bold">Created Date</p>
         <p>{{ task.createdAt }}</p>
      </div>
      <div class="flex flex-row justify-between">
         <p class="font-bold">Updated Date</p>
         <p>{{ task.updatedAt }}</p>
      </div>
      <div class="flex flex-row justify-between">
         <p class="font-bold">Assigned To</p>
         <p>{{ task.assignedTo }}</p>
      </div>
      <div class="flex flex-row justify-between">
         <p class="font-bold">Status</p>
         <p>{{ task.status }}</p>
      </div>
      <div class="flex flex-row justify-between">
         <p class="font-bold">Priority</p>
         <p>{{ task.priority }}</p>
      </div>
      <div class="flex flex-row justify-between">
         <p class="font-bold">Due Date</p>
         <p>{{ task.dueDate }}</p>
      </div>
    </div>
    <template #footer>
      <!-- <AppButton variant="ghost" @click="emit('close')">Close</AppButton>
      <AppButton variant="danger" @click="save">Save Task</AppButton> -->
    </template>
  </AppModal>
</template>
<script setup>
const props = defineProps({
  open: { type: Boolean, default: false },
  task: { type: Object, default: false }
})
const emit = defineEmits(['close', 'save'])

function save() {
  emit('save')
}
</script>