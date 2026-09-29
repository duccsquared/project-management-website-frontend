<template>
  <div class="min-h-screen bg-surface-0 text-text">
    <div class="flex h-screen overflow-hidden">
      <AppSidebar/>
      <div class="flex-1 flex flex-col overflow-hidden">
        <AppTopbar/>
        <main class="flex-1 overflow-y-auto px-6 py-8 md:px-10">
          <slot/>
        </main>
      </div>
    </div>
    <ToastStack/>
  </div>
</template>
<script setup>

</script>