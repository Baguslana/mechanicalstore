<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
})

const router = useRouter()
const cartStore = useCartStore()

// Use formatted_price from API or format manually as fallback
const formattedPrice = computed(() => {
  return (
    props.product.formatted_price ||
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(props.product.price)
  )
})

// Stock status from API
const stockStatus = computed(
  () =>
    props.product.stock_status || {
      label: props.product.in_stock ? 'In Stock' : 'Out of Stock',
      color: props.product.in_stock ? 'green' : 'red',
    },
)

// Stock badge color
const stockBadgeColor = computed(() => {
  const colorMap = {
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
  }
  return colorMap[stockStatus.value.color] || 'bg-gray-500'
})

// Get badges from details
const badges = computed(() => {
  if (!props.product.details) return []
  return props.product.details.badges || []
})

// Check if product is in cart
const isInCart = computed(() => cartStore.isInCart(props.product.id))

// Navigate to product detail
const viewProduct = () => {
  router.push(`/products/${props.product.slug}`)
}

// Add to cart handler
const addToCart = () => {
  if (!props.product.in_stock) return

  const result = cartStore.addItem(props.product)

  if (result.success) {
    // Show success feedback (you can use a toast/notification library)
    console.log('✅', result.message)

    // Optional: Open cart sidebar
    cartStore.openCart()
  } else {
    console.warn('⚠️', result.message)
    alert(result.message)
  }
}
</script>

<template>
  <div
    class="group relative bg-white dark:bg-stone-900 rounded-xl overflow-hidden border border-stone-200 dark:border-stone-800 hover:border-primary/50 dark:hover:border-primary/50 transition-all duration-300 hover:shadow-xl cursor-pointer"
    @click="viewProduct"
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
        v-if="!product.in_stock"
        :class="[
          'absolute top-3 right-3 text-white text-xs font-bold px-3 py-1 rounded-full',
          stockBadgeColor,
        ]"
      >
        {{ stockStatus.label }}
      </div>

      <!-- Low Stock Badge -->
      <div
        v-else-if="stockStatus.color === 'yellow'"
        :class="[
          'absolute top-3 right-3 text-white text-xs font-bold px-3 py-1 rounded-full',
          stockBadgeColor,
        ]"
      >
        {{ stockStatus.label }}
      </div>

      <!-- In Cart Badge -->
      <div
        v-if="isInCart"
        class="absolute top-3 left-3 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1"
      >
        <span class="material-symbols-outlined text-sm">check_circle</span>
        In Cart
      </div>

      <!-- Category Badge -->
      <div
        v-else
        class="absolute top-3 left-3 bg-white/90 dark:bg-stone-800/90 backdrop-blur-sm text-stone-700 dark:text-stone-300 text-xs font-medium px-3 py-1 rounded-full"
      >
        {{ product.category.name }}
      </div>

      <!-- Quick Add Overlay -->
      <div
        class="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        @click.stop
      >
        <button
          v-if="isInCart"
          @click="cartStore.openCart()"
          class="bg-white text-primary font-bold px-6 py-3 rounded-lg transition-all transform translate-y-2 group-hover:translate-y-0 hover:bg-stone-100"
        >
          <span class="flex items-center gap-2">
            <span class="material-symbols-outlined text-sm">shopping_cart</span>
            View Cart
          </span>
        </button>
        <button
          v-else
          :disabled="!product.in_stock"
          @click="addToCart"
          class="bg-primary hover:bg-primary/90 text-white font-bold px-6 py-3 rounded-lg transition-all transform translate-y-2 group-hover:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="product.in_stock" class="flex items-center gap-2">
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

      <!-- Badges from API -->
      <div v-if="badges.length > 0" class="flex flex-wrap gap-2 mb-4">
        <span
          v-for="(badge, index) in badges.slice(0, 3)"
          :key="index"
          class="text-xs bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 px-2 py-1 rounded-md"
        >
          {{ badge }}
        </span>
      </div>

      <!-- Fallback: Show specs if no badges -->
      <div
        v-else-if="product.specs && Object.keys(product.specs).length > 0"
        class="flex flex-wrap gap-2 mb-4"
      >
        <span
          v-for="(value, key) in Object.entries(product.specs).slice(0, 3)"
          :key="key"
          class="text-xs bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 px-2 py-1 rounded-md"
        >
          {{ value[1] }}
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

        <!-- Quick Add to Cart Button (Mobile) -->
        <button
          v-if="product.in_stock && !isInCart"
          @click.stop="addToCart"
          class="md:hidden flex items-center justify-center h-10 w-10 rounded-lg bg-primary hover:bg-primary/90 text-white transition-all"
        >
          <span class="material-symbols-outlined text-xl">add_shopping_cart</span>
        </button>

        <!-- View Detail Button -->
        <button
          v-else
          @click.stop="viewProduct"
          class="flex items-center justify-center h-10 w-10 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-primary hover:text-white dark:hover:bg-primary text-stone-700 dark:text-stone-300 transition-all"
        >
          <span class="material-symbols-outlined text-xl">arrow_forward</span>
        </button>
      </div>
    </div>
  </div>
</template>
