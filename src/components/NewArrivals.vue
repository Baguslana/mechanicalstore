<script setup>
import { ref } from 'vue'

const products = ref([
  {
    id: 1,
    name: 'New Switch Model',
    description: 'Experience the latest in switch technology.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAwLyS9HF2hrxhrIemxFpxgC_cVWV9uod3_AbYqbUQji4r0hxk8wEZYjcAYjAAEmmYyGTKcumYrKoHbdEmU1YmwwuYIGUtkOZScMbRIF3GgN3_RQMHigfkP4Kmx-IoguG4mvW0ijEKE3WJmG_AxaZlNcaJO4cHDczorp5CmJUyiMqle-_vRvbuE0ekCCi8oB8XNEyVWfM00WkbNZiH4dgRyCzP_C3Mmmi0mPft-QfuIpIHH9kvYCpzXkKxeKmOcHSu8p9OPmRf0rdo',
  },
  {
    id: 2,
    name: 'Artisan Keycap',
    description: 'Add a unique touch to your keyboard.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuADrQ7SuDJXbxbVgQ3apHeNXRDutIEOgIl54ks9Pf2lMhFB6sZsml7m63gu_1Vz4JL7OhoZ9P1Nbis4luHNDSPBaIBcW8oBkk5MXd1PotQp8C8IBARDP3_niTjgjfh5Zk-TFSy1Q8OpEInu1XeeYT4xGHVFX9GDQ8prnZpQve6KNj9_6iADbv2_Drhk12svrMhxPq6PY_6YHulEEPWJdMVZoxd5eMf5yix-caKv52raFN6MAEV9iZcyTG3XSExtujGzOnv9R3bjtvE',
  },
])
</script>

<template>
  <section class="py-12 md:py-16">
    <h2 class="text-2xl md:text-3xl font-bold tracking-tight text-stone-900 dark:text-white mb-6">
      New Arrivals
    </h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 gap-6">
      <div
        v-for="product in products"
        :key="product.id"
        class="bg-background-light dark:bg-stone-900/50 rounded-lg overflow-hidden group border border-stone-200 dark:border-stone-800 cursor-pointer hover:border-primary dark:hover:border-primary transition-colors"
      >
        <div
          class="w-full h-64 bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
          :style="{ backgroundImage: `url('${product.image}')` }"
        ></div>
        <div class="p-4">
          <h3 class="font-bold text-lg text-stone-900 dark:text-white">{{ product.name }}</h3>
          <p class="text-sm text-stone-600 dark:text-stone-400">{{ product.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
