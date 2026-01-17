<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import Header from '../components/Header.vue'
import api from '../services/api'

const router = useRouter()
const cartStore = useCartStore()

const loading = ref(false)
const currentStep = ref(1) // 1: Info, 2: Review, 3: Payment

// Form data
const form = ref({
  customer_name: '',
  customer_email: '',
  customer_phone: '',
  shipping_address: '',
  city: '',
  province: '',
  postal_code: '',
  payment_method: 'bank_transfer',
  customer_notes: '',
})

// Calculations
const subtotal = computed(() => cartStore.totalPrice)
const shippingCost = 20000 // Flat rate
const tax = computed(() => Math.round(subtotal.value * 0.11)) // PPN 11%
const total = computed(() => subtotal.value + shippingCost + tax.value)

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price)
}

// Validation
const validateStep1 = () => {
  if (!form.value.customer_name) {
    alert('Please enter your name')
    return false
  }
  if (!form.value.customer_email) {
    alert('Please enter your email')
    return false
  }
  if (!form.value.customer_phone) {
    alert('Please enter your phone number')
    return false
  }
  if (!form.value.shipping_address) {
    alert('Please enter shipping address')
    return false
  }
  if (!form.value.city) {
    alert('Please enter city')
    return false
  }
  if (!form.value.province) {
    alert('Please enter province')
    return false
  }
  if (!form.value.postal_code) {
    alert('Please enter postal code')
    return false
  }
  return true
}

const nextStep = () => {
  if (currentStep.value === 1) {
    if (validateStep1()) {
      currentStep.value = 2
    }
  } else if (currentStep.value === 2) {
    currentStep.value = 3
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const submitOrder = async () => {
  if (cartStore.items.length === 0) {
    alert('Your cart is empty')
    return
  }

  loading.value = true

  try {
    // Prepare order data
    const orderData = {
      ...form.value,
      items: cartStore.items.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
      })),
    }

    const response = await api.post('/orders', orderData)

    if (response.data.success) {
      const order = response.data.data

      // Clear cart
      cartStore.clearCart()

      // Redirect to success page
      router.push(`/order-success/${order.order_number}`)
    } else {
      alert('Failed to create order: ' + response.data.message)
    }
  } catch (error) {
    console.error('Error creating order:', error)
    const errorMessage = error.response?.data?.message || error.message
    const errors = error.response?.data?.errors

    if (errors) {
      const errorList = Object.values(errors).flat().join('\n')
      alert('Validation Error:\n' + errorList)
    } else {
      alert('Error: ' + errorMessage)
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-background-light dark:bg-background-dark">
    <Header />

    <main class="max-w-7xl mx-auto px-4 md:px-8 py-8">
      <!-- Page Title -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-stone-900 dark:text-white mb-2">Checkout</h1>
        <p class="text-stone-600 dark:text-stone-400">Complete your order</p>
      </div>

      <!-- Empty Cart State -->
      <div v-if="cartStore.items.length === 0" class="text-center py-16">
        <span class="material-symbols-outlined text-6xl text-stone-300 dark:text-stone-700 mb-4">
          shopping_cart
        </span>
        <h2 class="text-2xl font-bold text-stone-900 dark:text-white mb-4">Your cart is empty</h2>
        <button
          @click="router.push('/products')"
          class="bg-primary text-white font-medium px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
        >
          Continue Shopping
        </button>
      </div>

      <!-- Checkout Form -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column - Form -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Progress Steps -->
          <div class="flex items-center justify-between mb-8">
            <div v-for="step in 3" :key="step" class="flex items-center flex-1">
              <div class="flex items-center gap-2">
                <div
                  :class="[
                    'h-10 w-10 rounded-full flex items-center justify-center font-bold',
                    currentStep >= step
                      ? 'bg-primary text-white'
                      : 'bg-stone-200 dark:bg-stone-800 text-stone-500 dark:text-stone-400',
                  ]"
                >
                  {{ step }}
                </div>
                <span
                  :class="[
                    'text-sm font-medium hidden md:block',
                    currentStep >= step
                      ? 'text-stone-900 dark:text-white'
                      : 'text-stone-500 dark:text-stone-400',
                  ]"
                >
                  {{ step === 1 ? 'Information' : step === 2 ? 'Review' : 'Payment' }}
                </span>
              </div>
              <div
                v-if="step < 3"
                :class="[
                  'flex-1 h-1 mx-4',
                  currentStep > step ? 'bg-primary' : 'bg-stone-200 dark:bg-stone-800',
                ]"
              ></div>
            </div>
          </div>

          <!-- Step 1: Customer Information -->
          <div
            v-show="currentStep === 1"
            class="bg-white dark:bg-stone-900 rounded-xl p-6 border border-stone-200 dark:border-stone-800"
          >
            <h2 class="text-xl font-bold text-stone-900 dark:text-white mb-6">
              Customer Information
            </h2>

            <div class="space-y-4">
              <!-- Name -->
              <div>
                <label class="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                  Full Name *
                </label>
                <input
                  v-model="form.customer_name"
                  type="text"
                  required
                  placeholder="John Doe"
                  class="w-full px-4 py-3 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800 text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <!-- Email -->
              <div>
                <label class="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                  Email Address *
                </label>
                <input
                  v-model="form.customer_email"
                  type="email"
                  required
                  placeholder="john@example.com"
                  class="w-full px-4 py-3 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800 text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <!-- Phone -->
              <div>
                <label class="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                  Phone Number *
                </label>
                <input
                  v-model="form.customer_phone"
                  type="tel"
                  required
                  placeholder="08123456789"
                  class="w-full px-4 py-3 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800 text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <h3 class="text-lg font-bold text-stone-900 dark:text-white mt-6 mb-4">
                Shipping Address
              </h3>

              <!-- Address -->
              <div>
                <label class="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                  Street Address *
                </label>
                <textarea
                  v-model="form.shipping_address"
                  required
                  rows="3"
                  placeholder="Jl. Example No. 123"
                  class="w-full px-4 py-3 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800 text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                ></textarea>
              </div>

              <!-- City & Province -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                    City *
                  </label>
                  <input
                    v-model="form.city"
                    type="text"
                    required
                    placeholder="Jakarta"
                    class="w-full px-4 py-3 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800 text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                    Province *
                  </label>
                  <input
                    v-model="form.province"
                    type="text"
                    required
                    placeholder="DKI Jakarta"
                    class="w-full px-4 py-3 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800 text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <!-- Postal Code -->
              <div>
                <label class="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                  Postal Code *
                </label>
                <input
                  v-model="form.postal_code"
                  type="text"
                  required
                  placeholder="12345"
                  class="w-full px-4 py-3 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800 text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <!-- Notes -->
              <div>
                <label class="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                  Order Notes (Optional)
                </label>
                <textarea
                  v-model="form.customer_notes"
                  rows="3"
                  placeholder="Additional notes for your order..."
                  class="w-full px-4 py-3 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800 text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Step 2: Review Order -->
          <div
            v-show="currentStep === 2"
            class="bg-white dark:bg-stone-900 rounded-xl p-6 border border-stone-200 dark:border-stone-800"
          >
            <h2 class="text-xl font-bold text-stone-900 dark:text-white mb-6">Review Your Order</h2>

            <!-- Customer Info Summary -->
            <div class="bg-stone-50 dark:bg-stone-800 rounded-lg p-4 mb-6">
              <h3 class="font-semibold text-stone-900 dark:text-white mb-3">
                Delivery Information
              </h3>
              <div class="text-sm text-stone-600 dark:text-stone-400 space-y-1">
                <p><strong>Name:</strong> {{ form.customer_name }}</p>
                <p><strong>Email:</strong> {{ form.customer_email }}</p>
                <p><strong>Phone:</strong> {{ form.customer_phone }}</p>
                <p>
                  <strong>Address:</strong> {{ form.shipping_address }}, {{ form.city }},
                  {{ form.province }} {{ form.postal_code }}
                </p>
              </div>
            </div>

            <!-- Order Items -->
            <div class="space-y-4">
              <div
                v-for="item in cartStore.items"
                :key="item.id"
                class="flex gap-4 pb-4 border-b border-stone-200 dark:border-stone-800 last:border-0"
              >
                <img :src="item.image" :alt="item.name" class="w-20 h-20 rounded-lg object-cover" />
                <div class="flex-1">
                  <h4 class="font-semibold text-stone-900 dark:text-white">{{ item.name }}</h4>
                  <p class="text-sm text-stone-600 dark:text-stone-400">{{ item.category }}</p>
                  <p class="text-sm text-stone-600 dark:text-stone-400">Qty: {{ item.quantity }}</p>
                </div>
                <div class="text-right">
                  <p class="font-semibold text-stone-900 dark:text-white">
                    {{ formatPrice(item.price * item.quantity) }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 3: Payment Method -->
          <div
            v-show="currentStep === 3"
            class="bg-white dark:bg-stone-900 rounded-xl p-6 border border-stone-200 dark:border-stone-800"
          >
            <h2 class="text-xl font-bold text-stone-900 dark:text-white mb-6">Payment Method</h2>

            <div class="space-y-3">
              <label
                v-for="method in [
                  { value: 'bank_transfer', label: 'Bank Transfer', icon: 'account_balance' },
                  { value: 'e_wallet', label: 'E-Wallet (OVO, GoPay, Dana)', icon: 'wallet' },
                  { value: 'credit_card', label: 'Credit Card', icon: 'credit_card' },
                  { value: 'cod', label: 'Cash on Delivery', icon: 'local_shipping' },
                ]"
                :key="method.value"
                class="flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-colors"
                :class="
                  form.payment_method === method.value
                    ? 'border-primary bg-primary/5'
                    : 'border-stone-200 dark:border-stone-800 hover:border-primary/50'
                "
              >
                <input
                  v-model="form.payment_method"
                  type="radio"
                  :value="method.value"
                  class="w-5 h-5"
                />
                <span class="material-symbols-outlined text-2xl text-primary">{{
                  method.icon
                }}</span>
                <span class="flex-1 font-medium text-stone-900 dark:text-white">{{
                  method.label
                }}</span>
              </label>
            </div>

            <div
              class="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
            >
              <p class="text-sm text-blue-700 dark:text-blue-400">
                <strong>Note:</strong> Payment instructions will be sent to your email after placing
                the order.
              </p>
            </div>
          </div>

          <!-- Navigation Buttons -->
          <div class="flex gap-4">
            <button
              v-if="currentStep > 1"
              @click="prevStep"
              class="flex-1 px-6 py-4 rounded-lg border-2 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 font-medium hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              Back
            </button>
            <button
              v-if="currentStep < 3"
              @click="nextStep"
              class="flex-1 px-6 py-4 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors"
            >
              Continue
            </button>
            <button
              v-else
              @click="submitOrder"
              :disabled="loading"
              class="flex-1 px-6 py-4 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <span v-if="loading" class="material-symbols-outlined animate-spin">refresh</span>
              <span>{{ loading ? 'Processing...' : 'Place Order' }}</span>
            </button>
          </div>
        </div>

        <!-- Right Column - Order Summary -->
        <div class="lg:col-span-1">
          <div
            class="bg-white dark:bg-stone-900 rounded-xl p-6 border border-stone-200 dark:border-stone-800 sticky top-24"
          >
            <h2 class="text-xl font-bold text-stone-900 dark:text-white mb-6">Order Summary</h2>

            <div class="space-y-3 mb-6">
              <div class="flex justify-between text-stone-600 dark:text-stone-400">
                <span>Subtotal ({{ cartStore.itemCount }} items)</span>
                <span>{{ formatPrice(subtotal) }}</span>
              </div>
              <div class="flex justify-between text-stone-600 dark:text-stone-400">
                <span>Shipping</span>
                <span>{{ formatPrice(shippingCost) }}</span>
              </div>
              <div class="flex justify-between text-stone-600 dark:text-stone-400">
                <span>Tax (PPN 11%)</span>
                <span>{{ formatPrice(tax) }}</span>
              </div>
              <div
                class="border-t border-stone-200 dark:border-stone-800 pt-3 flex justify-between"
              >
                <span class="text-lg font-bold text-stone-900 dark:text-white">Total</span>
                <span class="text-lg font-bold text-primary">{{ formatPrice(total) }}</span>
              </div>
            </div>

            <div class="bg-stone-50 dark:bg-stone-800 rounded-lg p-4">
              <p class="text-xs text-stone-600 dark:text-stone-400">
                By placing this order, you agree to our Terms & Conditions and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
