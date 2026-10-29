<template>
  <AppModal :open="open" :title="`${task?.name}`" dismissible width="max-w-lg" @close="closePopup()">
    <template #subtitle>
      <div v-if="!editMode">{{ task?.description }}</div>
    </template>
    <div v-if="editMode" class="flex flex-col gap-4 p-4">
      <AppInput label="Name" v-model="editedTask.name"/>
      <AppTextarea label="Description" v-model="editedTask.description"/>
      <AppInput label="Assigned To" v-model="editedTask.assignedTo"/>
      <AppInput label="Status" v-model="editedTask.status"/>
      <AppInput label="Priority" v-model="editedTask.priority"/>
      <AppInput label="Due Date" v-model="editedTask.dueDate" type="date"/>
    </div>
    <div v-else-if="task!=null" class="flex flex-col gap-4 p-4" >
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
      <AppButton v-if="editMode" variant="ghost" @click="editMode = false">Cancel</AppButton>
      <AppButton v-if="editMode" variant="primary" @click="saveTask" :loading="saveLoading">Save Task</AppButton>
      <AppButton v-else variant="primary" @click="editTask">Edit Task</AppButton>
    </template>
  </AppModal>
</template>
<script setup>
import { useFormatDate } from '~/composables/useFormatDate';
import { useErrorWrapper } from '~/composables/useErrorWrapper';
import { useApi } from '~/composables/useApi';
import { onMounted } from 'vue';
const { formatDate } = useFormatDate();
const { showSuccess, showError } = useNotification();

const props = defineProps({
  open: { type: Boolean, default: false },
  task: { type: Object, default: null }
})
const emit = defineEmits(['close', 'save'])

const saveLoading = ref(false);
const editMode = ref(false);
const editedTask = ref({});

const editTask = () => {
  editedTask.value = props.task
  editedTask.value.dueDate = formatDate(editedTask.value.dueDate)
  editMode.value = true
}

const saveTask = useErrorWrapper(async () => {
  if(editedTask.value==null) {return}

  editedTask.value.dueDate = formatDate(editedTask.value.dueDate, 'iso')

  if(editedTask.value.id) {
    // update
    await useApi('PUT', `/tasks/${editedTask.value.id}`, null, editedTask.value)
  }
  else {
    // create
  }

  emit('save', editedTask.value)
  closePopup()
}, saveLoading)

const closePopup = () => {
  editMode.value = false;
  editedTask.value = {};
  emit('close')
}
</script>