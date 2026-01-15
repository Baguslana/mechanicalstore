<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Header from '../components/Header.vue'
import FilterSidebar from '../components/FilterSidebar.vue'
import ProductCard from '../components/ProductCard.vue'
import { productsApi, categoriesApi } from '../services/api'

const router = useRouter()
const route = useRoute()

// State
const products = ref([])
const categories = ref([])
const loading = ref(false)
const error = ref(null)

// Filter states
const selectedCategory = ref('All Products')
const selectedSize = ref('All Sizes')
const selectedSwitchType = ref('All Types')
const selectedPriceRange = ref({ label: 'All Prices', min: 0, max: Infinity })
const showInStockOnly = ref(false)
const searchQuery = ref('')
const sortBy = ref('created_at')
const sortOrder = ref('desc')
const showMobileFilters = ref(false)

// Animation
const pageRef = ref(null)

onMounted(async () => {
  // Load categories
  await loadCategories()

  // Load filters from URL query params
  loadFiltersFromURL()

  // Load products
  await fetchProducts()

  // Animate on load
  setTimeout(() => {
    const animatedElements = pageRef.value?.querySelectorAll('.animate-on-load')
    animatedElements?.forEach((el) => {
      el.style.opacity = '1'
    })
  }, 100)
})

// Load categories from API
const loadCategories = async () => {
  try {
    const data = await categoriesApi.getAll()
    categories.value = data
  } catch (err) {
    console.error('Error loading categories:', err)
  }
}

// Load filters from URL
const loadFiltersFromURL = () => {
  if (route.query.category) selectedCategory.value = route.query.category
  if (route.query.size) selectedSize.value = route.query.size
  if (route.query.switch_type) selectedSwitchType.value = route.query.switch_type
  if (route.query.in_stock_only) showInStockOnly.value = route.query.in_stock_only === '1'
  if (route.query.search) searchQuery.value = route.query.search
  if (route.query.sort_by) sortBy.value = route.query.sort_by
  if (route.query.sort_order) sortOrder.value = route.query.sort_order
}

// Update URL when filters change
const updateURL = () => {
  const query = {}
  if (selectedCategory.value !== 'All Products') query.category = selectedCategory.value
  if (selectedSize.value !== 'All Sizes') query.size = selectedSize.value
  if (selectedSwitchType.value !== 'All Types') query.switch_type = selectedSwitchType.value
  if (showInStockOnly.value) query.in_stock_only = '1'
  if (searchQuery.value) query.search = searchQuery.value
  if (sortBy.value !== 'created_at') query.sort_by = sortBy.value
  if (sortOrder.value !== 'desc') query.sort_order = sortOrder.value

  router.replace({ query })
}

// Fetch products from API
const fetchProducts = async () => {
  loading.value = true
  error.value = null

  try {
    const filters = {
      category: selectedCategory.value !== 'All Products' ? selectedCategory.value : null,
      size: selectedSize.value !== 'All Sizes' ? selectedSize.value : null,
      switchType: selectedSwitchType.value !== 'All Types' ? selectedSwitchType.value : null,
      minPrice: selectedPriceRange.value.min || null,
      maxPrice: selectedPriceRange.value.max !== Infinity ? selectedPriceRange.value.max : null,
      inStockOnly: showInStockOnly.value,
      search: searchQuery.value || null,
      sortBy: sortBy.value,
      sortOrder: sortOrder.value,
    }

    const data = await productsApi.getAll(filters)
    products.value = Array.isArray(data) ? data : data.data || []

    // Update URL
    updateURL()
  } catch (err) {
    error.value = 'Failed to load products. Please try again.'
    console.error('Error fetching products:', err)
  } finally {
    loading.value = false
  }
}

// Watch filters and refetch
watch(
  [selectedCategory, selectedSize, selectedSwitchType, selectedPriceRange, showInStockOnly],
  () => {
    fetchProducts()
  },
)

// Debounced search
let searchTimeout
watch(searchQuery, () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    fetchProducts()
  }, 500) // 500ms debounce
})

// Watch sort changes
watch([sortBy, sortOrder], () => {
  fetchProducts()
})

const clearFilters = () => {
  selectedCategory.value = 'All Products'
  selectedSize.value = 'All Sizes'
  selectedSwitchType.value = 'All Types'
  selectedPriceRange.value = { label: 'All Prices', min: 0, max: Infinity }
  showInStockOnly.value = false
  searchQuery.value = ''
}

// Convert sort select value to sortBy and sortOrder
const handleSortChange = (value) => {
  switch (value) {
    case 'price-low':
      sortBy.value = 'price'
      sortOrder.value = 'asc'
      break
    case 'price-high':
      sortBy.value = 'price'
      sortOrder.value = 'desc'
      break
    case 'name':
      sortBy.value = 'name'
      sortOrder.value = 'asc'
      break
    case 'newest':
      sortBy.value = 'created_at'
      sortOrder.value = 'desc'
      break
    default:
      sortBy.value = 'created_at'
      sortOrder.value = 'desc'
  }
}

const sortValue = computed(() => {
  if (sortBy.value === 'price' && sortOrder.value === 'asc') return 'price-low'
  if (sortBy.value === 'price' && sortOrder.value === 'desc') return 'price-high'
  if (sortBy.value === 'name') return 'name'
  if (sortBy.value === 'created_at') return 'newest'
  return 'newest'
})
</script>

<template>
  <div ref="pageRef" class="relative min-h-screen bg-background-light dark:bg-background-dark">
    <Header />

    <!-- Hero Banner -->
    <div
      class="relative bg-gradient-to-r from-primary to-blue-600 text-white px-4 md:px-8 py-12 md:py-16 animate-on-load animate-fade-in"
      style="animation-delay: 0.1s"
    >
      <div class="max-w-7xl mx-auto">
        <h1
          class="text-3xl md:text-5xl font-bold mb-4 animate-on-load animate-fade-in-up"
          style="animation-delay: 0.2s"
        >
          Build Your Dream Keyboard
        </h1>
        <p
          class="text-base md:text-lg text-white/90 max-w-2xl animate-on-load animate-fade-in-up"
          style="animation-delay: 0.3s"
        >
          Browse our extensive collection of premium custom keyboard kits, switches, keycaps, and
          accessories
        </p>
      </div>
    </div>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 md:px-8 py-8">
      <!-- Search & Sort Bar -->
      <div
        class="flex flex-col md:flex-row gap-4 mb-8 animate-on-load animate-fade-in-up"
        style="animation-delay: 0.4s"
      >
        <!-- Search -->
        <div class="relative flex-1">
          <span
            class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
          >
            search
          </span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search products..."
            class="w-full h-12 pl-12 pr-4 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <!-- Sort & Mobile Filter Toggle -->
        <div class="flex gap-3">
          <select
            :value="sortValue"
            @change="handleSortChange($event.target.value)"
            class="h-12 px-4 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
          </select>

          <button
            @click="showMobileFilters = !showMobileFilters"
            class="md:hidden flex items-center gap-2 h-12 px-4 rounded-lg bg-primary text-white font-medium"
          >
            <span class="material-symbols-outlined">tune</span>
            Filters
          </button>
        </div>
      </div>

      <div class="flex gap-8">
        <!-- Desktop Sidebar -->
        <div
          class="hidden md:block w-64 flex-shrink-0 animate-on-load animate-fade-in"
          style="animation-delay: 0.5s"
        >
          <div class="sticky top-24">
            <FilterSidebar
              :selected-category="selectedCategory"
              :selected-size="selectedSize"
              :selected-switch-type="selectedSwitchType"
              :selected-price-range="selectedPriceRange"
              :show-in-stock-only="showInStockOnly"
              @update:selected-category="selectedCategory = $event"
              @update:selected-size="selectedSize = $event"
              @update:selected-switch-type="selectedSwitchType = $event"
              @update:selected-price-range="selectedPriceRange = $event"
              @update:show-in-stock-only="showInStockOnly = $event"
              @clear-filters="clearFilters"
            />
          </div>
        </div>

        <!-- Mobile Sidebar (Overlay) -->
        <Transition name="slide">
          <div
            v-if="showMobileFilters"
            class="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            @click="showMobileFilters = false"
          >
            <div
              class="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-background-light dark:bg-background-dark p-6 overflow-y-auto shadow-2xl"
              @click.stop
            >
              <div class="flex items-center justify-between mb-6">
                <h2 class="text-xl font-bold text-stone-900 dark:text-white">Filters</h2>
                <button
                  @click="showMobileFilters = false"
                  class="h-10 w-10 flex items-center justify-center rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300"
                >
                  <span class="material-symbols-outlined">close</span>
                </button>
              </div>
              <FilterSidebar
                :selected-category="selectedCategory"
                :selected-size="selectedSize"
                :selected-switch-type="selectedSwitchType"
                :selected-price-range="selectedPriceRange"
                :show-in-stock-only="showInStockOnly"
                @update:selected-category="selectedCategory = $event"
                @update:selected-size="selectedSize = $event"
                @update:selected-switch-type="selectedSwitchType = $event"
                @update:selected-price-range="selectedPriceRange = $event"
                @update:show-in-stock-only="showInStockOnly = $event"
                @clear-filters="clearFilters"
              />
            </div>
          </div>
        </Transition>

        <!-- Products Grid -->
        <div class="flex-1">
          <!-- Results Info -->
          <div
            class="flex items-center justify-between mb-6 animate-on-load animate-fade-in-up"
            style="animation-delay: 0.6s"
          >
            <p class="text-sm text-stone-600 dark:text-stone-400">
              <span v-if="loading">Loading...</span>
              <span v-else>
                Showing
                <span class="font-bold text-stone-900 dark:text-white">{{ products.length }}</span>
                products
              </span>
            </p>
          </div>

          <!-- Error State -->
          <div v-if="error" class="text-center py-16">
            <span class="material-symbols-outlined text-6xl text-red-500 mb-4">error</span>
            <h3 class="text-xl font-bold text-stone-900 dark:text-white mb-2">{{ error }}</h3>
            <button
              @click="fetchProducts"
              class="bg-primary text-white font-medium px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
          </div>

          <!-- Loading State -->
          <div v-else-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="i in 6"
              :key="i"
              class="animate-pulse bg-stone-200 dark:bg-stone-800 rounded-xl h-96"
            ></div>
          </div>

          <!-- Products Grid -->
          <div
            v-else-if="products.length > 0"
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-on-load animate-fade-in"
            style="animation-delay: 0.7s"
          >
            <ProductCard v-for="product in products" :key="product.id" :product="product" />
          </div>

          <!-- No Results -->
          <div
            v-else
            class="text-center py-16 animate-on-load animate-fade-in-up"
            style="animation-delay: 0.7s"
          >
            <span class="material-symbols-outlined text-6xl text-stone-300 dark:text-stone-700 mb-4"
              >search_off</span
            >
            <h3 class="text-xl font-bold text-stone-900 dark:text-white mb-2">No products found</h3>
            <p class="text-stone-600 dark:text-stone-400 mb-6">
              Try adjusting your filters or search query
            </p>
            <button
              @click="clearFilters"
              class="bg-primary text-white font-medium px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.3s;
}
.slide-enter-active > div,
.slide-leave-active > div {
  transition: transform 0.3s;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
}
.slide-enter-from > div {
  transform: translateX(100%);
}
.slide-leave-to > div {
  transform: translateX(100%);
}

.animate-on-load {
  opacity: 0;
}
</style>
