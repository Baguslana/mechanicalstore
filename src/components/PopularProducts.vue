<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { productsApi } from '../services/api'

const router = useRouter()
const products = ref([])
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    const data = await productsApi.getAll({
      inStockOnly: true,
    })
    // Get random 6 products as "popular" (or implement actual popularity logic)
    const allProducts = Array.isArray(data) ? data : data.data || []
    products.value = allProducts.sort(() => 0.5 - Math.random()).slice(0, 6)
  } catch (error) {
    console.error('Error loading popular products:', error)
  } finally {
    loading.value = false
  }
})

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price)
}

const viewProduct = (slug) => {
  router.push(`/products/${slug}`)
}
</script>

<template>
  <section class="mt-16">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h2 class="text-3xl font-bold text-stone-900 dark:text-white mb-2">Popular Products</h2>
        <p class="text-stone-600 dark:text-stone-400">Trending in our store</p>
      </div>
      <button
        @click="router.push('/products')"
        class="text-primary hover:text-primary/80 font-medium flex items-center gap-2 transition-colors"
      >
        <span>View All</span>
        <span class="material-symbols-outlined">arrow_forward</span>
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="i in 6"
        :key="i"
        class="animate-pulse bg-stone-200 dark:bg-stone-800 rounded-xl h-80"
      ></div>
    </div>

    <!-- Products Grid -->
    <div
      v-else-if="products.length > 0"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <div
        v-for="product in products"
        :key="product.id"
        @click="viewProduct(product.slug)"
        class="group bg-white dark:bg-stone-900 rounded-xl overflow-hidden border border-stone-200 dark:border-stone-800 hover:border-primary/50 transition-all hover:shadow-xl cursor-pointer"
      >
        <!-- Image -->
        <div class="relative h-48 overflow-hidden bg-stone-100 dark:bg-stone-800">
          <img
            :src="product.image"
            :alt="product.name"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div
            class="absolute top-3 right-3 bg-white/90 dark:bg-stone-800/90 backdrop-blur-sm text-stone-700 dark:text-stone-300 text-xs font-medium px-3 py-1 rounded-full"
          >
            {{ product.category.name }}
          </div>
        </div>

        <!-- Info -->
        <div class="p-4">
          <h3 class="font-bold text-stone-900 dark:text-white mb-2 line-clamp-1">
            {{ product.name }}
          </h3>
          <p class="text-sm text-stone-600 dark:text-stone-400 mb-4 line-clamp-2">
            {{ product.description }}
          </p>
          <div
            class="flex items-center justify-between pt-3 border-t border-stone-200 dark:border-stone-800"
          >
            <span class="text-xl font-bold text-primary">
              {{ formatPrice(product.price) }}
            </span>
            <span class="flex items-center gap-1 text-sm text-stone-500 dark:text-stone-400">
              <span
                class="material-symbols-outlined text-lg group-hover:text-primary transition-colors"
              >
                trending_up
              </span>
              Popular
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-16">
      <span class="material-symbols-outlined text-6xl text-stone-300 dark:text-stone-700 mb-4">
        inventory_2
      </span>
      <p class="text-stone-600 dark:text-stone-400">No popular products yet</p>
    </div>
  </section>
</template>
