<script setup>
import { computed } from 'vue'

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
})

const formattedPrice = computed(() => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(props.product.price)
})
</script>

<template>
  <div
    class="group relative bg-white dark:bg-stone-900 rounded-xl overflow-hidden border border-stone-200 dark:border-stone-800 hover:border-primary/50 dark:hover:border-primary/50 transition-all duration-300 hover:shadow-xl"
  >
    <!-- Product Image -->
    <div class="relative aspect-square overflow-hidden bg-stone-100 dark:bg-stone-800">
      <img
        :src="product.image"
        :alt="product.name"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />

      <!-- Stock Badge -->
      <div
        v-if="!product.inStock"
        class="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full"
      >
        Out of Stock
      </div>

      <!-- Category Badge -->
      <div
        class="absolute top-3 left-3 bg-white/90 dark:bg-stone-800/90 backdrop-blur-sm text-stone-700 dark:text-stone-300 text-xs font-medium px-3 py-1 rounded-full"
      >
        {{ product.category }}
      </div>

      <!-- Quick Add Overlay -->
      <div
        class="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        <button
          :disabled="!product.inStock"
          class="bg-primary hover:bg-primary/90 text-white font-bold px-6 py-3 rounded-lg transition-all transform translate-y-2 group-hover:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="product.inStock" class="flex items-center gap-2">
            <span class="material-symbols-outlined text-sm">add_shopping_cart</span>
            Add to Cart
          </span>
          <span v-else>Out of Stock</span>
        </button>
      </div>
    </div>

    <!-- Product Info -->
    <div class="p-4">
      <h3 class="font-bold text-stone-900 dark:text-white text-lg mb-2 line-clamp-1">
        {{ product.name }}
      </h3>
      <p class="text-sm text-stone-600 dark:text-stone-400 mb-3 line-clamp-2">
        {{ product.description }}
      </p>

      <!-- Specs Pills -->
      <div class="flex flex-wrap gap-2 mb-4">
        <span
          v-for="(spec, index) in product.specs.slice(0, 3)"
          :key="index"
          class="text-xs bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 px-2 py-1 rounded-md"
        >
          {{ spec }}
        </span>
      </div>

      <!-- Price & Action -->
      <div
        class="flex items-center justify-between pt-3 border-t border-stone-200 dark:border-stone-800"
      >
        <div>
          <p class="text-xs text-stone-500 dark:text-stone-500 mb-1">Price</p>
          <p class="text-xl font-bold text-primary">{{ formattedPrice }}</p>
        </div>
        <button
          :disabled="!product.inStock"
          class="flex items-center justify-center h-10 w-10 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-primary hover:text-white dark:hover:bg-primary text-stone-700 dark:text-stone-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-stone-100 dark:disabled:hover:bg-stone-800"
        >
          <span class="material-symbols-outlined text-xl">arrow_forward</span>
        </button>
      </div>
    </div>
  </div>
</template>
