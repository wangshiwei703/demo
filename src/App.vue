<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="vite-vue3-template-app">
    <RouterView></RouterView>
  </div>
</template>

<style scoped>
.vite-vue3-template-app {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  background-image: radial-gradient(circle, #165f2b 1px, #0000 1px);
  background-size: 20px 20px;

  /* overflow: hidden; */
}
</style>
