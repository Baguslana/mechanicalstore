<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Header from '../components/Header.vue'
import api from '../services/api'

const route = useRoute()
const router = useRouter()

const order = ref(null)
const loading = ref(false)

onMounted(async () => {
  await loadOrder()
})

const loadOrder = async () => {
  loading.value = true

  try {
    const orderNumber = route.params.orderNumber
    const response = await api.get(`/orders/${orderNumber}`)

    if (response.data.success) {
      order.value = response.data.data
    } else {
      router.push('/products')
    }
  } catch (error) {
    console.error('Error loading order:', error)
    router.push('/products')
  } finally {
    loading.value = false
  }
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price)
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const getPaymentMethodLabel = (method) => {
  const labels = {
    bank_transfer: 'Bank Transfer',
    e_wallet: 'E-Wallet',
    credit_card: 'Credit Card',
    cod: 'Cash on Delivery',
  }
  return labels[method] || method
}

const printOrder = () => {
  window.print()
}
</script>

<template>
  <div class="min-h-screen bg-background-light dark:bg-background-dark print:bg-white">
    <Header class="print:hidden" />

    <!-- Loading State -->
    <div v-if="loading" class="max-w-4xl mx-auto px-4 md:px-8 py-16 text-center">
      <span
        class="material-symbols-outlined text-6xl text-stone-300 dark:text-stone-700 animate-spin"
        >refresh</span
      >
      <p class="text-stone-600 dark:text-stone-400 mt-4">Loading order details...</p>
    </div>

    <!-- Order Success -->
    <main v-else-if="order" class="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-16">
      <!-- Success Icon & Message -->
      <div class="text-center mb-8">
        <div
          class="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full mb-4"
        >
          <span class="material-symbols-outlined text-5xl text-green-600 dark:text-green-400"
            >check_circle</span
          >
        </div>
        <h1 class="text-3xl md:text-4xl font-bold text-stone-900 dark:text-white mb-2">
          Order Placed Successfully!
        </h1>
        <p class="text-lg text-stone-600 dark:text-stone-400">
          Thank you for your purchase. Your order has been received.
        </p>
      </div>

      <!-- Order Details Card -->
      <div
        class="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 overflow-hidden mb-6"
      >
        <!-- Order Header -->
        <div class="bg-primary text-white px-6 py-4">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p class="text-sm opacity-90 mb-1">Order Number</p>
              <p class="text-2xl font-bold">{{ order.order_number }}</p>
            </div>
            <div class="text-left md:text-right">
              <p class="text-sm opacity-90 mb-1">Order Date</p>
              <p class="font-semibold">{{ formatDate(order.created_at) }}</p>
            </div>
          </div>
        </div>

        <!-- Order Body -->
        <div class="p-6 space-y-6">
          <!-- Customer Information -->
          <div>
            <h2 class="text-lg font-bold text-stone-900 dark:text-white mb-4">
              Customer Information
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p class="text-stone-600 dark:text-stone-400 mb-1">Name</p>
                <p class="font-medium text-stone-900 dark:text-white">{{ order.customer_name }}</p>
              </div>
              <div>
                <p class="text-stone-600 dark:text-stone-400 mb-1">Email</p>
                <p class="font-medium text-stone-900 dark:text-white">{{ order.customer_email }}</p>
              </div>
              <div>
                <p class="text-stone-600 dark:text-stone-400 mb-1">Phone</p>
                <p class="font-medium text-stone-900 dark:text-white">{{ order.customer_phone }}</p>
              </div>
              <div>
                <p class="text-stone-600 dark:text-stone-400 mb-1">Payment Method</p>
                <p class="font-medium text-stone-900 dark:text-white">
                  {{ getPaymentMethodLabel(order.payment_method) }}
                </p>
              </div>
            </div>
          </div>

          <!-- Shipping Address -->
          <div>
            <h2 class="text-lg font-bold text-stone-900 dark:text-white mb-4">Shipping Address</h2>
            <div class="bg-stone-50 dark:bg-stone-800 rounded-lg p-4">
              <p class="text-stone-900 dark:text-white">{{ order.shipping_address }}</p>
              <p class="text-stone-600 dark:text-stone-400">
                {{ order.city }}, {{ order.province }} {{ order.postal_code }}
              </p>
            </div>
          </div>

          <!-- Order Items -->
          <div>
            <h2 class="text-lg font-bold text-stone-900 dark:text-white mb-4">Order Items</h2>
            <div class="space-y-4">
              <div
                v-for="item in order.items"
                :key="item.id"
                class="flex gap-4 pb-4 border-b border-stone-200 dark:border-stone-800 last:border-0"
              >
                <img
                  :src="item.product_image"
                  :alt="item.product_name"
                  class="w-20 h-20 rounded-lg object-cover bg-stone-100 dark:bg-stone-800"
                />
                <div class="flex-1">
                  <h4 class="font-semibold text-stone-900 dark:text-white">
                    {{ item.product_name }}
                  </h4>
                  <p class="text-sm text-stone-600 dark:text-stone-400">
                    {{ formatPrice(item.price) }} × {{ item.quantity }}
                  </p>
                </div>
                <div class="text-right">
                  <p class="font-semibold text-stone-900 dark:text-white">
                    {{ formatPrice(item.subtotal) }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Summary -->
          <div class="border-t border-stone-200 dark:border-stone-800 pt-4">
            <div class="space-y-2 mb-4">
              <div class="flex justify-between text-stone-600 dark:text-stone-400">
                <span>Subtotal</span>
                <span>{{ formatPrice(order.subtotal) }}</span>
              </div>
              <div class="flex justify-between text-stone-600 dark:text-stone-400">
                <span>Shipping</span>
                <span>{{ formatPrice(order.shipping_cost) }}</span>
              </div>
              <div class="flex justify-between text-stone-600 dark:text-stone-400">
                <span>Tax (PPN 11%)</span>
                <span>{{ formatPrice(order.tax) }}</span>
              </div>
            </div>
            <div
              class="flex justify-between items-center pt-4 border-t border-stone-200 dark:border-stone-800"
            >
              <span class="text-xl font-bold text-stone-900 dark:text-white">Total</span>
              <span class="text-2xl font-bold text-primary">{{ formatPrice(order.total) }}</span>
            </div>
          </div>

          <!-- Payment Instructions -->
          <div
            v-if="order.payment_method === 'bank_transfer'"
            class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4"
          >
            <h3 class="font-bold text-yellow-900 dark:text-yellow-400 mb-2 flex items-center gap-2">
              <span class="material-symbols-outlined">info</span>
              Payment Instructions
            </h3>
            <div class="text-sm text-yellow-800 dark:text-yellow-300 space-y-2">
              <p>Please transfer to:</p>
              <div class="bg-white dark:bg-stone-800 rounded p-3 font-mono">
                <p><strong>Bank:</strong> Bank Central Asia (BCA)</p>
                <p><strong>Account Number:</strong> 1234567890</p>
                <p><strong>Account Name:</strong> MechKey Store</p>
                <p><strong>Amount:</strong> {{ formatPrice(order.total) }}</p>
              </div>
              <p class="text-xs">
                After payment, please send proof of transfer to our WhatsApp: 08123456789
              </p>
            </div>
          </div>

          <!-- Customer Notes -->
          <div v-if="order.customer_notes" class="bg-stone-50 dark:bg-stone-800 rounded-lg p-4">
            <p class="text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">Your Notes:</p>
            <p class="text-stone-600 dark:text-stone-400">{{ order.customer_notes }}</p>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row gap-4 print:hidden">
        <button
          @click="printOrder"
          class="flex-1 px-6 py-4 rounded-lg border-2 border-primary text-primary font-medium hover:bg-primary/10 transition-colors flex items-center justify-center gap-2"
        >
          <span class="material-symbols-outlined">print</span>
          <span>Print Order</span>
        </button>
        <button
          @click="router.push('/products')"
          class="flex-1 px-6 py-4 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors"
        >
          Continue Shopping
        </button>
      </div>

      <!-- Help Section -->
      <div class="mt-8 text-center text-sm text-stone-600 dark:text-stone-400">
        <p>Need help with your order?</p>
        <p class="mt-2">
          Contact us at
          <a href="mailto:support@mechkey.com" class="text-primary hover:underline"
            >support@mechkey.com</a
          >
          or WhatsApp
          <a href="https://wa.me/628123456789" class="text-primary hover:underline">08123456789</a>
        </p>
      </div>
    </main>
  </div>
</template>

<style>
@media print {
  body {
    background: white;
  }

  .print\:hidden {
    display: none !important;
  }

  .print\:bg-white {
    background: white !important;
  }
}
</style>
