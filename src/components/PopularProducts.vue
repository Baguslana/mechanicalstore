<script setup>
import { ref } from 'vue'

const products = ref([
  {
    id: 1,
    name: 'Tactile Switches',
    description: 'For a satisfying bump.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCV5S5YOK0J_tYhOtslEqAr_nFD6YMifpBTCyaxcmBaqzG00aVuUT0vr51HKhT7daySR5S1QRsNqd0fO9Kff2yIEoC1loni8b5vLV1uLBHfOAwzTj_qKaBgqPC2iBJlAItVUhKjFMNjnWFISLc_LscT2-gf098b9Qg2VA7Y9IFa3VgX4RFa5Rd0MXr0q3NpIX99Rsr5WWBO4QY8dLKO5fD4m9AhKTxNVRi_exa4dYQeoCnHLLRPFGabShmI1mm1WJlQk4ESjTIvA_o',
  },
  {
    id: 2,
    name: 'Linear Switches',
    description: 'Smooth and consistent.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCPrAsYrvyDctFUulBmcbFe4FwooRe0TP8vQCl8gjXkntRLxIXFy0B6PQx3G65mR6n6D17ze0-7Z_wOqsXtwiOQgi3AX6RQxD9TkWjoOxh9hle7TNRUtAFwmiZ6WJp05MBlNoLCwtxvirGE5JwVK9m7HUDrj5zoge4dkUC_i04IhaJBGUWI3ANiyqIgn09QigsuMtdvP8QZzLHdJFj3o705xxl5R4Vlb7VeRgPk3J2DmUq04MGg0p9g3H1hKc61ax5w5f48jUX21iM',
  },
  {
    id: 3,
    name: 'Sculpted Keycaps',
    description: 'Ergonomic for comfort.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDS6Z3_j9_GhtTb2kZpUY4Rdm6nVj0QE5O1u7Vc6CU6Op_8hm3ocHlAxpqh1gdy0K1GvQrBaj5yk-uje9Tvz7yReFztNhypQT0Zv7qAv9vP8OVGDgqtVUedelHR3OUPE5fIMYEzrbrbswuiA6FaAH2rFivgroviVR4Ak-6MbMlz3YnrZ23fiHiVt-rjUnWkoVWJMyma-Z_zuzKu7ZZ_TSsoc8SYLyfATEqcxegM1Ex1d1AI0Vl2jGMpMZsM_EtHcr8QRddmLypvY4o',
  },
  {
    id: 4,
    name: 'PBT Keycaps',
    description: 'Durable and textured.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCfXH-tuFmG3EuagbSn4yFpyb3vZNr4g6B9LkUUpEg4BIJ98fpS7GZsHgquBw03CwdbJieKsRTf4bHrp8DPP1ZFfDvp3G9UYW9NcJpO9UN68FR_SMf0UKmSdGYf6CO5pvlVzcRjZsgijPblgcFQfCs6v2MvYGJjrMtVPPwamj2w8d982N0N5v2cy_KGESIdkTgWq4o9dNGL-S8q_uun6aQF0jiIbPZ1zq4ByeDxGaOa9DfARqm31mymzGv-P0nU61I6gfiMpQDyuAU',
  },
])
</script>

<template>
  <section class="py-12 md:py-16">
    <h2 class="text-2xl md:text-3xl font-bold tracking-tight text-stone-900 dark:text-white mb-6">
      Popular Products
    </h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div
        v-for="product in products"
        :key="product.id"
        class="bg-background-light dark:bg-stone-900/50 rounded-lg overflow-hidden group border border-stone-200 dark:border-stone-800 cursor-pointer hover:border-primary dark:hover:border-primary transition-colors"
      >
        <div
          class="w-full aspect-square bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
          :style="{ backgroundImage: `url('${product.image}')` }"
        ></div>
        <div class="p-4">
          <h3 class="font-bold text-base text-stone-900 dark:text-white">{{ product.name }}</h3>
          <p class="text-sm text-stone-600 dark:text-stone-400">{{ product.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
