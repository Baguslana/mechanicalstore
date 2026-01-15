<script setup>
import { useCartStore } from '../stores/cart'
import { useRouter } from 'vue-router'

const cartStore = useCartStore()
const router = useRouter()

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price)
}

const goToCheckout = () => {
  cartStore.closeCart()
  router.push('/checkout')
}
</script>

<template>
  <!-- Overlay -->
  <Transition name="fade">
    <div
      v-if="cartStore.isCartOpen"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
      @click="cartStore.closeCart()"
    ></div>
  </Transition>

  <!-- Sidebar -->
  <Transition name="slide-left">
    <aside
      v-if="cartStore.isCartOpen"
      class="fixed right-0 top-0 h-full w-full sm:w-96 bg-white dark:bg-stone-900 shadow-2xl z-50 flex flex-col"
    >
      <!-- Header -->
      <div
        class="flex items-center justify-between p-6 border-b border-stone-200 dark:border-stone-800"
      >
        <div class="flex items-center gap-3">
          <span class="material-symbols-outlined text-primary text-2xl">shopping_cart</span>
          <div>
            <h2 class="text-xl font-bold text-stone-900 dark:text-white">Shopping Cart</h2>
            <p class="text-sm text-stone-500 dark:text-stone-400">
              {{ cartStore.itemCount }} {{ cartStore.itemCount === 1 ? 'item' : 'items' }}
            </p>
          </div>
        </div>
        <button
          @click="cartStore.closeCart()"
          class="h-10 w-10 flex items-center justify-center rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition-colors"
        >
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <!-- Cart Items -->
      <div class="flex-1 overflow-y-auto p-6">
        <!-- Empty State -->
        <div
          v-if="cartStore.items.length === 0"
          class="flex flex-col items-center justify-center h-full text-center"
        >
          <span class="material-symbols-outlined text-6xl text-stone-300 dark:text-stone-700 mb-4">
            shopping_cart
          </span>
          <h3 class="text-lg font-bold text-stone-900 dark:text-white mb-2">Your cart is empty</h3>
          <p class="text-sm text-stone-600 dark:text-stone-400 mb-6">
            Add some products to get started!
          </p>
          <button
            @click="cartStore.closeCart()"
            class="bg-primary text-white font-medium px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Continue Shopping
          </button>
        </div>

        <!-- Cart Items List -->
        <div v-else class="space-y-4">
          <div
            v-for="item in cartStore.items"
            :key="item.id"
            class="flex gap-4 p-4 bg-stone-50 dark:bg-stone-800/50 rounded-lg"
          >
            <!-- Product Image -->
            <div
              class="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-stone-200 dark:bg-stone-700"
            >
              <img :src="item.image" :alt="item.name" class="w-full h-full object-cover" />
            </div>

            <!-- Product Info -->
            <div class="flex-1 min-w-0">
              <h4 class="font-semibold text-stone-900 dark:text-white text-sm mb-1 truncate">
                {{ item.name }}
              </h4>
              <p class="text-xs text-stone-500 dark:text-stone-400 mb-2">
                {{ item.category }}
              </p>
              <p class="text-sm font-bold text-primary">
                {{ formatPrice(item.price) }}
              </p>

              <!-- Quantity Controls -->
              <div class="flex items-center gap-2 mt-3">
                <button
                  @click="cartStore.decrementQuantity(item.id)"
                  class="h-7 w-7 flex items-center justify-center rounded bg-stone-200 dark:bg-stone-700 hover:bg-stone-300 dark:hover:bg-stone-600 text-stone-700 dark:text-stone-300 transition-colors"
                >
                  <span class="material-symbols-outlined text-sm">remove</span>
                </button>
                <span class="text-sm font-medium text-stone-900 dark:text-white w-8 text-center">
                  {{ item.quantity }}
                </span>
                <button
                  @click="cartStore.incrementQuantity(item.id)"
                  :disabled="item.stock_quantity && item.quantity >= item.stock_quantity"
                  class="h-7 w-7 flex items-center justify-center rounded bg-stone-200 dark:bg-stone-700 hover:bg-stone-300 dark:hover:bg-stone-600 text-stone-700 dark:text-stone-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span class="material-symbols-outlined text-sm">add</span>
                </button>
              </div>
            </div>

            <!-- Remove Button -->
            <button
              @click="cartStore.removeItem(item.id)"
              class="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors"
              title="Remove from cart"
            >
              <span class="material-symbols-outlined text-lg">delete</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div
        v-if="cartStore.items.length > 0"
        class="border-t border-stone-200 dark:border-stone-800 p-6 space-y-4"
      >
        <!-- Subtotal -->
        <div class="flex items-center justify-between">
          <span class="text-stone-600 dark:text-stone-400">Subtotal</span>
          <span class="text-xl font-bold text-stone-900 dark:text-white">
            {{ cartStore.formattedTotal }}
          </span>
        </div>

        <!-- Checkout Button -->
        <button
          @click="goToCheckout"
          class="w-full bg-primary text-white font-bold py-4 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
        >
          <span>Proceed to Checkout</span>
          <span class="material-symbols-outlined">arrow_forward</span>
        </button>

        <!-- Continue Shopping -->
        <button
          @click="cartStore.closeCart()"
          class="w-full text-stone-600 dark:text-stone-400 font-medium py-3 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    </aside>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform 0.3s;
}
.slide-left-enter-from,
.slide-left-leave-to {
  transform: translateX(100%);
}
</style>
