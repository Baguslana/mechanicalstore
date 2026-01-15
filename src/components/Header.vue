<script setup>
import { useCartStore } from '../stores/cart'
import { useRouter } from 'vue-router'

const cartStore = useCartStore()
const router = useRouter()

const navigateToProducts = () => {
  router.push('/products')
}
</script>

<template>
  <header
    class="sticky top-0 z-20 flex items-center justify-between whitespace-nowrap border-b border-stone-200/80 dark:border-stone-800/80 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm px-4 md:px-8 py-3"
  >
    <div class="flex items-center gap-4">
      <h1
        @click="router.push('/')"
        class="text-xl font-bold text-stone-900 dark:text-white tracking-tight cursor-pointer hover:text-primary transition-colors"
      >
        MechKey
      </h1>
    </div>

    <nav class="hidden md:flex items-center gap-8">
      <button
        @click="navigateToProducts"
        class="text-sm font-medium text-stone-600 dark:text-stone-300 hover:text-primary dark:hover:text-primary transition-colors"
      >
        Shop All
      </button>
      <a
        href="#"
        class="text-sm font-medium text-stone-600 dark:text-stone-300 hover:text-primary dark:hover:text-primary transition-colors"
      >
        About Us
      </a>
      <a
        href="#"
        class="text-sm font-medium text-stone-600 dark:text-stone-300 hover:text-primary dark:hover:text-primary transition-colors"
      >
        Contact
      </a>
    </nav>

    <div class="flex items-center gap-2">
      <!-- Cart Button -->
      <button
        @click="cartStore.toggleCart()"
        class="relative flex items-center justify-center rounded-lg h-10 px-4 bg-stone-100 dark:bg-stone-800/50 hover:bg-stone-200 dark:hover:bg-stone-700/50 text-stone-700 dark:text-stone-200 text-sm font-bold transition-colors"
      >
        <span class="material-symbols-outlined mr-2 -ml-1">shopping_cart</span>
        <span class="hidden sm:inline">Cart</span>

        <!-- Badge -->
        <span
          v-if="cartStore.itemCount > 0"
          class="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center bg-primary text-white text-xs font-bold rounded-full"
        >
          {{ cartStore.itemCount > 9 ? '9+' : cartStore.itemCount }}
        </span>
      </button>

      <!-- Search Button -->
      <button
        class="flex items-center justify-center rounded-lg h-10 w-10 bg-stone-100 dark:bg-stone-800/50 hover:bg-stone-200 dark:hover:bg-stone-700/50 text-stone-700 dark:text-stone-200 text-sm font-bold transition-colors"
      >
        <span class="material-symbols-outlined">search</span>
      </button>
    </div>
  </header>
</template>
