<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminStore } from '../stores/admin'

const router = useRouter()
const adminStore = useAdminStore()

const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const handleLogin = () => {
  error.value = ''
  loading.value = true

  setTimeout(() => {
    const result = adminStore.login(username.value, password.value)

    if (result.success) {
      router.push('/admin/products')
    } else {
      error.value = result.message || 'Invalid credentials'
    }

    loading.value = false
  }, 500)
}
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center p-4"
  >
    <div class="w-full max-w-md">
      <!-- Logo/Brand -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-white mb-2">MechKey</h1>
        <p class="text-white/80">Admin Panel</p>
      </div>

      <!-- Login Card -->
      <div class="bg-white dark:bg-stone-900 rounded-2xl shadow-2xl p-8">
        <h2 class="text-2xl font-bold text-stone-900 dark:text-white mb-6">Sign In</h2>

        <!-- Error Message -->
        <div
          v-if="error"
          class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg mb-6 flex items-center gap-2"
        >
          <span class="material-symbols-outlined text-sm">error</span>
          <span class="text-sm">{{ error }}</span>
        </div>

        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="space-y-4">
          <!-- Username -->
          <div>
            <label class="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
              Username
            </label>
            <input
              v-model="username"
              type="text"
              required
              placeholder="Enter username"
              class="w-full px-4 py-3 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <!-- Password -->
          <div>
            <label class="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
              Password
            </label>
            <input
              v-model="password"
              type="password"
              required
              placeholder="Enter password"
              class="w-full px-4 py-3 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <span v-if="loading" class="material-symbols-outlined animate-spin">refresh</span>
            <span v-else>Sign In</span>
          </button>
        </form>

        <!-- Demo Credentials -->
        <div class="mt-6 p-4 bg-stone-50 dark:bg-stone-800 rounded-lg">
          <p class="text-xs text-stone-600 dark:text-stone-400 mb-2 font-medium">
            Demo Credentials:
          </p>
          <div class="text-xs text-stone-500 dark:text-stone-500 space-y-1">
            <p><strong>Username:</strong> admin</p>
            <p><strong>Password:</strong> admin123</p>
          </div>
        </div>

        <!-- Back to Home -->
        <div class="mt-6 text-center">
          <button
            @click="router.push('/')"
            class="text-sm text-stone-600 dark:text-stone-400 hover:text-primary transition-colors"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
