<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { productsApi } from '../services/api'
import { useCartStore } from '../stores/cart'
import Header from '../components/Header.vue'
import ProductCard from '../components/ProductCard.vue'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()

const product = ref(null)
const relatedProducts = ref([])
const loading = ref(false)
const error = ref(null)
const quantity = ref(1)

onMounted(async () => {
  await loadProduct()
})

const loadProduct = async () => {
  loading.value = true
  error.value = null

  try {
    const slug = route.params.slug
    const data = await productsApi.getBySlug(slug, { includeRelated: true })
    product.value = data

    // Load related products (same category)
    if (data.category) {
      const allProducts = await productsApi.getAll({
        category: data.category.name,
        inStockOnly: true,
      })
      relatedProducts.value = (Array.isArray(allProducts) ? allProducts : allProducts.data || [])
        .filter((p) => p.id !== data.id)
        .slice(0, 4)
    }
  } catch (err) {
    console.error('Error loading product:', err)
    error.value = 'Product not found'
  } finally {
    loading.value = false
  }
}

const formatPrice = computed(() => {
  if (!product.value) return ''
  return (
    product.value.formatted_price ||
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(product.value.price)
  )
})

const stockStatus = computed(() => {
  if (!product.value) return null
  return (
    product.value.stock_status || {
      label: product.value.in_stock ? 'In Stock' : 'Out of Stock',
      color: product.value.in_stock ? 'green' : 'red',
    }
  )
})

const stockBadgeColor = computed(() => {
  const colorMap = {
    green: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
    yellow: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
    red: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
  }
  return colorMap[stockStatus.value?.color] || 'bg-gray-100 text-gray-700'
})

const badges = computed(() => {
  if (!product.value?.details) return []
  return product.value.details.badges || []
})

const specs = computed(() => {
  if (!product.value?.specs) return {}
  return product.value.specs
})

const details = computed(() => {
  if (!product.value?.details) return null
  return product.value.details
})

const canAddToCart = computed(() => {
  return (
    product.value?.in_stock && quantity.value > 0 && quantity.value <= product.value.stock_quantity
  )
})

const incrementQuantity = () => {
  if (product.value && quantity.value < product.value.stock_quantity) {
    quantity.value++
  }
}

const decrementQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const addToCart = () => {
  if (!canAddToCart.value) return

  const result = cartStore.addItem(product.value, quantity.value)

  if (result.success) {
    cartStore.openCart()
  } else {
    alert(result.message)
  }
}

const buyNow = () => {
  if (!canAddToCart.value) return

  cartStore.addItem(product.value, quantity.value)
  router.push('/checkout')
}

const goBack = () => {
  router.push('/products')
}
</script>

<template>
  <div class="min-h-screen bg-background-light dark:bg-background-dark">
    <Header />

    <!-- Loading State -->
    <div v-if="loading" class="max-w-7xl mx-auto px-4 md:px-8 py-8">
      <div class="animate-pulse">
        <div class="h-8 w-48 bg-stone-200 dark:bg-stone-800 rounded mb-8"></div>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div class="aspect-square bg-stone-200 dark:bg-stone-800 rounded-xl"></div>
          <div class="space-y-4">
            <div class="h-8 bg-stone-200 dark:bg-stone-800 rounded w-3/4"></div>
            <div class="h-6 bg-stone-200 dark:bg-stone-800 rounded w-1/2"></div>
            <div class="h-20 bg-stone-200 dark:bg-stone-800 rounded"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="max-w-7xl mx-auto px-4 md:px-8 py-16 text-center">
      <span class="material-symbols-outlined text-6xl text-stone-300 dark:text-stone-700 mb-4"
        >error</span
      >
      <h2 class="text-2xl font-bold text-stone-900 dark:text-white mb-4">{{ error }}</h2>
      <button
        @click="goBack"
        class="bg-primary text-white font-medium px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
      >
        Back to Products
      </button>
    </div>

    <!-- Product Detail -->
    <main v-else-if="product" class="max-w-7xl mx-auto px-4 md:px-8 py-8">
      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-sm mb-8 text-stone-600 dark:text-stone-400">
        <button @click="router.push('/')" class="hover:text-primary transition-colors">Home</button>
        <span class="material-symbols-outlined text-sm">chevron_right</span>
        <button @click="goBack" class="hover:text-primary transition-colors">Products</button>
        <span class="material-symbols-outlined text-sm">chevron_right</span>
        <button
          @click="router.push(`/products?category=${product.category.name}`)"
          class="hover:text-primary transition-colors"
        >
          {{ product.category.name }}
        </button>
        <span class="material-symbols-outlined text-sm">chevron_right</span>
        <span class="text-stone-900 dark:text-white font-medium">{{ product.name }}</span>
      </nav>

      <!-- Product Info Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
        <!-- Product Image -->
        <div class="relative">
          <div class="sticky top-24">
            <div
              class="aspect-square rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-800"
            >
              <img :src="product.image" :alt="product.name" class="w-full h-full object-cover" />
            </div>

            <!-- Category Badge on Image -->
            <div
              class="absolute top-4 left-4 bg-white/90 dark:bg-stone-800/90 backdrop-blur-sm px-4 py-2 rounded-lg"
            >
              <span class="text-sm font-medium text-stone-700 dark:text-stone-300">
                {{ product.category.name }}
              </span>
            </div>
          </div>
        </div>

        <!-- Product Details -->
        <div class="space-y-6">
          <!-- Title & Price -->
          <div>
            <h1 class="text-3xl md:text-4xl font-bold text-stone-900 dark:text-white mb-4">
              {{ product.name }}
            </h1>
            <div class="flex items-center gap-4 mb-4">
              <span class="text-4xl font-bold text-primary">{{ formatPrice }}</span>
              <span :class="['px-4 py-2 rounded-lg text-sm font-medium', stockBadgeColor]">
                {{ stockStatus.label }}
              </span>
            </div>
          </div>

          <!-- Badges -->
          <div v-if="badges.length > 0" class="flex flex-wrap gap-2">
            <span
              v-for="(badge, index) in badges"
              :key="index"
              class="px-3 py-1 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-sm font-medium rounded-lg"
            >
              {{ badge }}
            </span>
          </div>

          <!-- Description -->
          <div class="prose dark:prose-invert">
            <p class="text-stone-600 dark:text-stone-400 leading-relaxed">
              {{ product.description }}
            </p>
          </div>

          <!-- Quantity & Actions -->
          <div
            v-if="product.in_stock"
            class="space-y-4 pt-4 border-t border-stone-200 dark:border-stone-800"
          >
            <div>
              <label class="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                Quantity
              </label>
              <div class="flex items-center gap-4">
                <div
                  class="flex items-center border border-stone-200 dark:border-stone-800 rounded-lg"
                >
                  <button
                    @click="decrementQuantity"
                    class="h-12 w-12 flex items-center justify-center hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors rounded-l-lg"
                  >
                    <span class="material-symbols-outlined">remove</span>
                  </button>
                  <input
                    v-model.number="quantity"
                    type="number"
                    min="1"
                    :max="product.stock_quantity"
                    class="h-12 w-20 text-center border-x border-stone-200 dark:border-stone-800 bg-transparent text-stone-900 dark:text-white font-medium focus:outline-none"
                  />
                  <button
                    @click="incrementQuantity"
                    class="h-12 w-12 flex items-center justify-center hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors rounded-r-lg"
                  >
                    <span class="material-symbols-outlined">add</span>
                  </button>
                </div>
                <span class="text-sm text-stone-600 dark:text-stone-400">
                  {{ product.stock_quantity }} available
                </span>
              </div>
            </div>

            <div class="flex gap-3">
              <button
                @click="addToCart"
                :disabled="!canAddToCart"
                class="flex-1 bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-bold py-4 rounded-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <span class="material-symbols-outlined">shopping_cart</span>
                <span>Add to Cart</span>
              </button>
              <button
                @click="buyNow"
                :disabled="!canAddToCart"
                class="flex-1 bg-primary text-white font-bold py-4 rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Buy Now
              </button>
            </div>
          </div>

          <!-- Out of Stock Message -->
          <div
            v-else
            class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
          >
            <p class="text-red-700 dark:text-red-400 font-medium">
              This product is currently out of stock
            </p>
          </div>
        </div>
      </div>

      <!-- Specifications Section -->
      <div v-if="Object.keys(specs).length > 0 || details" class="mb-16">
        <h2 class="text-2xl font-bold text-stone-900 dark:text-white mb-6">Specifications</h2>
        <div
          class="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 overflow-hidden"
        >
          <!-- General Specs -->
          <div
            v-if="Object.keys(specs).length > 0"
            class="divide-y divide-stone-200 dark:divide-stone-800"
          >
            <div
              v-for="(value, key) in specs"
              :key="key"
              class="grid grid-cols-2 gap-4 px-6 py-4 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors"
            >
              <span class="font-medium text-stone-700 dark:text-stone-300">{{ key }}</span>
              <span class="text-stone-900 dark:text-white">{{ value }}</span>
            </div>
          </div>

          <!-- Category-specific Details -->
          <div
            v-if="details"
            class="divide-y divide-stone-200 dark:divide-stone-800 border-t border-stone-200 dark:border-stone-800"
          >
            <div
              v-for="(value, key) in details"
              :key="key"
              class="grid grid-cols-2 gap-4 px-6 py-4 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors"
            >
              <span class="font-medium text-stone-700 dark:text-stone-300 capitalize">
                {{ key.replace(/_/g, ' ') }}
              </span>
              <span class="text-stone-900 dark:text-white">
                {{ typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Related Products -->
      <div v-if="relatedProducts.length > 0" class="mb-16">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-stone-900 dark:text-white">Related Products</h2>
          <button
            @click="router.push(`/products?category=${product.category.name}`)"
            class="text-primary hover:text-primary/80 font-medium flex items-center gap-2 transition-colors"
          >
            <span>View All</span>
            <span class="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ProductCard
            v-for="relatedProduct in relatedProducts"
            :key="relatedProduct.id"
            :product="relatedProduct"
          />
        </div>
      </div>
    </main>
  </div>
</template>
