<template>
    <div class="max-w-dashboard mx-auto">
      <AppCard :level="1" class="mt-4 flex flex-row justify-between items-center">
        <div class="flex flex-col items-start">
          <h1 class="text-page-title font-page-title text-text-strong">Projects</h1>
          <p class="text-body font-body text-text-muted mt-1">
            Overview of your current projects
          </p>
        </div>
        <AppButton icon="lucide:plus" to="/projects/new">Create New Project</AppButton>
      </AppCard>

      <AppCard v-if="isLoading" :level="1" class="mt-8 flex flex-col items-center">
        <p class="text-caption font-caption">Loading Data...</p>
      </AppCard>

      <AppCard v-if="!isLoading" :level="1" class="mt-4 flex flex-col gap-4">
        <AppCard v-for="project in projects" :level="2" :to="`/projects/${project.id}`" class="hover:bg-surface-3">
            <h2 class="text-card-title font-card-title">{{ project.name }}</h2>
            <p class="text-body font-body text-text-muted mt-1">{{ project.description }}</p>
        </AppCard>
      </AppCard>
    </div>
</template>
<script setup>
import { onMounted } from 'vue';
import { useErrorWrapper } from '~/composables/useErrorWrapper';
import { useApi } from '~/composables/useApi';
import useNotification from '~/composables/useNotification'
import { includes } from 'zod';
const { showSuccess, showError } = useNotification();

const isLoading = ref(false);

const projects = ref([]);


onMounted(() => {
  fetchData();
})

const fetchData = useErrorWrapper(async () => {
  projects.value = (await useApi("GET", "/projects", {"members$some.user.id$equals": 1, include: "owner"})).data;
  console.log(projects.value);
}, isLoading)
</script>