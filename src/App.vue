<script setup>
import { RouterView } from 'vue-router'
import CartSidebar from './components/CartSidebar.vue'
</script>

<template>
  <div id="app" class="min-h-screen bg-background-light dark:bg-background-dark">
    <RouterView />

    <!-- Global Cart Sidebar -->
    <CartSidebar />
  </div>
</template>

<style scoped>
#app {
  font-family: 'Space Grotesk', sans-serif;
}
</style>
