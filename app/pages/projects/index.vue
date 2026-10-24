<template>
    <div class="max-w-dashboard mx-auto">
      <AppCard :level="1" class="mt-4 gap-4 flex flex-col md:flex-row md:justify-between md:items-center">
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
        <AppCard v-for="project in projects" :key="project.id" :level="2" class="relative flex flex-row justify-between hover:bg-surface-3">
          <div>
            <h2 class="text-card-title font-card-title">
              <NuxtLink
                :to="`/projects/${project.id}`"
                class="after:absolute after:inset-0 after:rounded-card focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-primary"
              >
                {{ project.name }}
              </NuxtLink>
            </h2>
            <p class="text-body font-body text-text-muted mt-1">{{ project.description }}</p>
          </div>

          <AppButton
            icon="lucide:trash"
            variant="ghost"
            aria-label="Delete project"
            class="relative z-10 text-danger hover:text-danger-hover"
            :loading="loadingDelete"
            @click="openDeletePopup(project)"
          />
        </AppCard>
      </AppCard>

      <AppModal
        :open="deletePopup"
        title="Delete this project?"
        @close="deletePopup = false"
      >
        <template #subtitle>
          This will permanently remove {{selectedProject.name}} and all of its tasks. This can't be undone.
        </template>
        <template #footer>
          <AppButton variant="ghost" @click="deletePopup = false">Cancel</AppButton>
          <AppButton variant="danger" @click="deleteProject" :loading="loadingDelete">Delete project</AppButton>
        </template>
      </AppModal>

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
const loadingDelete = ref(false);

const user = ref({});
const projects = ref([]);

const selectedProject = ref(null);
const deletePopup = ref(false);


onMounted(() => {
  fetchData();
})

const fetchData = useErrorWrapper(async () => {
  user.value = JSON.parse(sessionStorage.getItem("user"));
  projects.value = (await useApi("GET", "/projects", {"members$some.user.id$equals": user.value.id, include: "owner"})).data;
  console.log(projects.value);
}, isLoading)

const openDeletePopup = (project) => {
  selectedProject.value  = project;
  deletePopup.value = true;
}

const deleteProject = useErrorWrapper(async () => {
  const response = await useApi("DELETE",`/projects/${selectedProject.value.id}`)
  projects.value = projects.value.filter((project) => project.id != response.data.id)
  showSuccess("Project deleted!")
  deletePopup.value = false;
}, loadingDelete)
</script>