<template>
  <div class="max-w-dashboard mx-auto">
    <AppCard :level="1" class="mt-4 gap-4 flex flex-col md:flex-row md:justify-between md:items-center">
      <div class="flex flex-col items-start">
        <h1 class="text-page-title font-page-title text-text-strong">Create new project</h1>
        <p class="text-body font-body text-text-muted mt-1">
          Setup a new project
        </p>
      </div>
      <AppButton icon="lucide:undo" to="/projects">Return</AppButton>
    </AppCard>

    <AppCard :level="1" class="mt-4 flex flex-col gap-4">
      <AppInput label="Name" v-model="project.name" required></AppInput>
      <AppTextarea label="Description" v-model="project.description"></AppTextarea>
      <AppButton @click="createProject" :loading="createLoading">Create Project</AppButton>
    </AppCard>
  </div>
</template>
<script setup>
import { onMounted } from 'vue';
import { useErrorWrapper } from '~/composables/useErrorWrapper';
import { useApi } from '~/composables/useApi';
import { useRouter } from 'vue-router';
import useNotification from '~/composables/useNotification'
import { includes } from 'zod';
const router = useRouter();
const { showSuccess, showError } = useNotification();

const isLoading = ref(false);
const createLoading = ref(false);

const user = ref({});
const project = ref({});

onMounted(() => {
  fetchData();
})

const fetchData = useErrorWrapper(async () => {
  user.value = JSON.parse(sessionStorage.getItem("user"));
  project.value.ownerId = user.value.id;
}, isLoading)

const createProject = useErrorWrapper(async () => {
  if (project.value.name == null || project.value.name == "") {
    showError("Name is required")
  }

  const response = await useApi("POST", '/projects', null, project.value)
  showSuccess("Project created", "redirecting to the prorject page...")

  // router.push(`/projects`);
  router.push(`/projects/${response.data.id}`);
}, createLoading)
</script>