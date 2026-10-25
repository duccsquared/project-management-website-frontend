<template>
  <div class="max-w-dashboard mx-auto">
    <AppCard :level="1" class="mt-4 gap-4 flex flex-col md:flex-row md:justify-between md:items-center">
      <div class="flex flex-col items-start">
        <h1 class="text-page-title font-page-title text-text-strong">{{ project.name ?? '-' }}</h1>
        <p class="text-body font-body text-text-muted mt-1">
          Project summary and details details
        </p>
      </div>
      <AppButton icon="lucide:undo" to="/projects">Return</AppButton>
    </AppCard>

    <AppCard v-if="isLoading" :level="1" class="mt-8 flex flex-col items-center">
      <p class="text-caption font-caption">Loading Data...</p>
    </AppCard>

    <AppCard v-if="!isLoading" :level="1" class="mt-4 flex flex-col gap-4">
      <AppTable :columns="columns" :rows="tasks">
        <template #cell-actions="{ row }">
          <AppButton icon="lucide:eye" variant="ghost" class="text-blue-500" @click="openTaskPopup(row)"/>
          <AppButton icon="lucide:trash" variant="ghost" class="text-red-500" @click="openDeleteTaskPopup(row)"/>
        </template>
      </AppTable>
    </AppCard>

    <TaskModal :open="taskPopup" :task="selectedtask" @close="taskPopup = false" @save="() => {}"/>
  </div>
</template>
<script setup>
import { onMounted } from 'vue';
import { useErrorWrapper } from '~/composables/useErrorWrapper';
import { useApi } from '~/composables/useApi';
import useNotification from '~/composables/useNotification'
import { includes } from 'zod';
const { showSuccess, showError } = useNotification();
const route = useRoute()

const isLoading = ref(false);
const loadingDelete = ref(false);

const user = ref({});
const project = ref({});
const tasks = ref([])

const selectedtask = ref(null);
const taskPopup = ref(false);


const columns = [
  {key: "id", label: "ID"},
  {key: "name", label: "Name"},
  {key: "status", label: "Status"},
  {key: "priority", label: "Priority"},
  {key: "assignedTo", label: "Assigned To"},
  {key: "dueDate", label: "Due Date"},
  {key: "actions", label: "Actions"}
]

onMounted(() => {
  fetchData();
})

const fetchData = useErrorWrapper(async () => {
  user.value = JSON.parse(sessionStorage.getItem("user"));
  const projectId = route.params.id;
  project.value = (await useApi("GET", `/projects/${projectId}`)).data;
  tasks.value = (await useApi("GET", `/tasks`, {projectId: projectId, include: "assignments.projectMember.user"}))?.data ?? [];
  tasks.value.forEach((task) => {
    task.assignedTo = task.assignments.length == 0 ? '-' : (task.assignments.length > 1 ? `${task.assignments.length} members` : task.assignments[0].projectMember.user.name);
  })
  console.log(project.value);
}, isLoading)

const openTaskPopup = (task) => {
  selectedtask.value = task;
  taskPopup.value = true;
}

const openDeleteTaskPopup = (task) => {
  showError("Feature Not Implemented Yet")
}
</script>