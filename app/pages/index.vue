<template>
  <div class="max-w-dashboard mx-auto">
    <!-- Page header -->
    <div class="flex items-start justify-between gap-4 flex-wrap">
      <div>
        <h1 class="text-page-title font-page-title text-text-strong">Welcome to Taskflow</h1>
        <p class="text-body font-body text-text-muted mt-1">
          See an overiew of your current tasks and projects
        </p>
      </div>
      <div/>
    </div>

    <AppCard v-if="isLoading" :level="1" class="mt-8 flex flex-col items-center">
      <p class="text-caption font-caption">Loading Data...</p>
    </AppCard>

    <AppCard v-if="!isLoading" :level="1" class="mt-8">
      <h2 class="text-section-title font-section-title">Task Overview</h2>
      <div class="flex flex-row space-x-4 mt-4">
        <AppCard :level="2" class="flex-1">
          <h3 class="text-card-title font-card-title">Overdue</h3>
          <p class="text-section-title font-section-title text-red-500 mt-2">2</p>
        </AppCard>
        <AppCard :level="2" class="flex-1">
          <h3 class="text-card-title font-card-title">In Progress</h3>
          <p class="text-section-title font-section-title text-yellow-500 mt-2">4</p>
        </AppCard>
        <AppCard :level="2" class="flex-1">
          <h3 class="text-card-title font-card-title">Not Started</h3>
          <p class="text-section-title font-section-title text-gray-500 mt-2">6</p>
        </AppCard>
      </div>
    </AppCard>

    <div v-if="!isLoading" class="flex flex-row space-x-4 mt-8">
      <AppCard :level="1" class="w-1/2">
        <h2 class="text-section-title font-section-title mb-4">Your Projects</h2>
        <p class="text-caption font-caption mt-4 text-gray-500">Not Implemented Yet</p>
        <p class="text-caption font-caption mt-4 text-gray-500">Number of projects: {{ projects.length }}</p>
      </AppCard>
      <AppCard :level="1" class="w-1/2">
        <h2 class="text-section-title font-section-title mb-4">Your Tasks</h2>
        <p class="text-caption font-caption mt-4 text-gray-500">Not Implemented Yet</p>
        <p class="text-caption font-caption mt-4 text-gray-500">Number of tasks: {{ tasks.length }}</p>
      </AppCard>
    </div>


    <AppCard v-if="!isLoading" :level="1" class="mt-8">
      <h2 class="text-section-title font-section-title">Notification Test Buttons</h2>
      <div class="flex flex-row space-x-3 mt-4">
        <AppButton variant="primary" @click="showSuccess('Success!', 'wow so cool')">Success</AppButton>
        <AppButton variant="secondary" @click="showError('Error!', 'not very cool :(')">Error</AppButton>
      </div>
    </AppCard>
  </div>
</template>
<script setup>
import { onMounted } from 'vue';
import { useErrorWrapper } from '~/composables/useErrorWrapper';
import { useApi } from '~/composables/useApi';
import useNotification from '~/composables/useNotification'
const { showSuccess, showError } = useNotification();

const isLoading = ref(false);
const tasks = ref([]);
const projects = ref([]);

onMounted(() => {
  fetchData();
})

const fetchData = useErrorWrapper(async () => {
  tasks.value = (await useApi("GET", "/tasks", {"assignments$some.projectMember.user.id$equals": sessionStorage.getItem("user").id})).data;
  projects.value = (await useApi("GET", "/projects", {"members$some.user.id$equals": sessionStorage.getItem("user").id})).data;
  console.log(tasks.value);
  console.log(projects.value);
  console.log(await useApi("GET", "/users"))
}, isLoading)
</script>
