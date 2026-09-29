<script setup>
const { initTheme } = useTheme()
onMounted(() => initTheme())
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage/>
    </NuxtLayout>
  </div>
</template>
