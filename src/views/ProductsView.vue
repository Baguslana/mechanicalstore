<script setup>
import { ref, computed, onMounted } from 'vue'
import Header from '../components/Header.vue'
import FilterSidebar from '../components/FilterSidebar.vue'
import ProductCard from '../components/ProductCard.vue'
import { products, priceRanges } from '../data/products.js'

// Filter states
const selectedCategory = ref('All Products')
const selectedSize = ref('All Sizes')
const selectedSwitchType = ref('All Types')
const selectedPriceRange = ref(priceRanges[0])
const showInStockOnly = ref(false)
const searchQuery = ref('')
const sortBy = ref('featured')
const showMobileFilters = ref(false)

// Animation
const pageRef = ref(null)

onMounted(() => {
  setTimeout(() => {
    const animatedElements = pageRef.value?.querySelectorAll('.animate-on-load')
    animatedElements?.forEach((el) => {
      el.style.opacity = '1'
    })
  }, 100)
})

// Filtered products
const filteredProducts = computed(() => {
  let filtered = [...products]

  // Category filter
  if (selectedCategory.value !== 'All Products') {
    filtered = filtered.filter((p) => p.category === selectedCategory.value)
  }

  // Size filter
  if (selectedSize.value !== 'All Sizes') {
    filtered = filtered.filter((p) => p.size === selectedSize.value)
  }

  // Switch type filter
  if (selectedSwitchType.value !== 'All Types') {
    filtered = filtered.filter((p) => p.switchType === selectedSwitchType.value)
  }

  // Price range filter
  filtered = filtered.filter(
    (p) => p.price >= selectedPriceRange.value.min && p.price <= selectedPriceRange.value.max,
  )

  // Stock filter
  if (showInStockOnly.value) {
    filtered = filtered.filter((p) => p.inStock)
  }

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query),
    )
  }

  // Sort
  if (sortBy.value === 'price-low') {
    filtered.sort((a, b) => a.price - b.price)
  } else if (sortBy.value === 'price-high') {
    filtered.sort((a, b) => b.price - a.price)
  } else if (sortBy.value === 'name') {
    filtered.sort((a, b) => a.name.localeCompare(b.name))
  }

  return filtered
})

const clearFilters = () => {
  selectedCategory.value = 'All Products'
  selectedSize.value = 'All Sizes'
  selectedSwitchType.value = 'All Types'
  selectedPriceRange.value = priceRanges[0]
  showInStockOnly.value = false
  searchQuery.value = ''
}
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
            v-model="sortBy"
            class="h-12 px-4 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="featured">Featured</option>
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
              Showing
              <span class="font-bold text-stone-900 dark:text-white">{{
                filteredProducts.length
              }}</span>
              products
            </p>
          </div>

          <!-- Products Grid -->
          <div
            v-if="filteredProducts.length > 0"
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-on-load animate-fade-in"
            style="animation-delay: 0.7s"
          >
            <ProductCard v-for="product in filteredProducts" :key="product.id" :product="product" />
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
