<script setup>
import Header from '../components/Header.vue'
import HeroSection from '../components/HeroSection.vue'
import NewArrivals from '../components/NewArrivals.vue'
import PopularProducts from '../components/PopularProducts.vue'
</script>

<template>
  <div class="relative min-h-screen">
    <Header />
    <main class="px-4 md:px-8 py-8 md:py-16">
      <div class="max-w-6xl mx-auto">
        <HeroSection />
        <NewArrivals />
        <PopularProducts />
      </div>
    </main>
  </div>
</template>
