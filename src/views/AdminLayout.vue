<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAdminStore } from '../stores/admin'

const router = useRouter()
const route = useRoute()
const adminStore = useAdminStore()

const sidebarOpen = ref(true)

// Check auth on mount
onMounted(() => {
  if (!adminStore.isAuthenticated) {
    router.push('/admin/login')
  }
})

const handleLogout = () => {
  if (confirm('Are you sure you want to logout?')) {
    adminStore.logout()
    router.push('/admin/login')
  }
}

const isActive = (path) => {
  return route.path === path
}
</script>

<template>
  <div class="flex h-screen bg-stone-100 dark:bg-stone-950">
    <!-- Sidebar -->
    <aside
      :class="[
        'bg-white dark:bg-stone-900 border-r border-stone-200 dark:border-stone-800 transition-all duration-300',
        sidebarOpen ? 'w-64' : 'w-20',
      ]"
    >
      <!-- Logo -->
      <div
        class="h-16 flex items-center justify-between px-4 border-b border-stone-200 dark:border-stone-800"
      >
        <div v-if="sidebarOpen" class="flex items-center gap-2">
          <span class="material-symbols-outlined text-primary text-2xl">dashboard</span>
          <span class="font-bold text-stone-900 dark:text-white">Admin</span>
        </div>
        <button
          @click="sidebarOpen = !sidebarOpen"
          class="h-10 w-10 flex items-center justify-center rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300"
        >
          <span class="material-symbols-outlined">{{ sidebarOpen ? 'menu_open' : 'menu' }}</span>
        </button>
      </div>

      <!-- Navigation -->
      <nav class="p-4 space-y-2">
        <!-- Dashboard -->
        <router-link
          to="/admin"
          :class="[
            'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
            isActive('/admin')
              ? 'bg-primary text-white'
              : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800',
          ]"
        >
          <span class="material-symbols-outlined">dashboard</span>
          <span v-if="sidebarOpen" class="font-medium">Dashboard</span>
        </router-link>

        <!-- Products -->
        <router-link
          to="/admin/products"
          :class="[
            'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
            isActive('/admin/products')
              ? 'bg-primary text-white'
              : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800',
          ]"
        >
          <span class="material-symbols-outlined">inventory_2</span>
          <span v-if="sidebarOpen" class="font-medium">Products</span>
        </router-link>

        <!-- Categories -->
        <router-link
          to="/admin/categories"
          :class="[
            'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
            isActive('/admin/categories')
              ? 'bg-primary text-white'
              : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800',
          ]"
        >
          <span class="material-symbols-outlined">category</span>
          <span v-if="sidebarOpen" class="font-medium">Categories</span>
        </router-link>

        <div class="border-t border-stone-200 dark:border-stone-800 my-4"></div>

        <!-- View Store -->
        <router-link
          to="/"
          :class="[
            'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800',
          ]"
        >
          <span class="material-symbols-outlined">storefront</span>
          <span v-if="sidebarOpen" class="font-medium">View Store</span>
        </router-link>
      </nav>

      <!-- User Info & Logout -->
      <div
        class="absolute bottom-0 left-0 right-0 p-4 border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900"
      >
        <div v-if="sidebarOpen" class="mb-3">
          <p class="text-sm font-medium text-stone-900 dark:text-white">
            {{ adminStore.adminUser?.name }}
          </p>
          <p class="text-xs text-stone-500 dark:text-stone-400">
            {{ adminStore.adminUser?.email }}
          </p>
        </div>
        <button
          @click="handleLogout"
          :class="[
            'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors w-full text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20',
          ]"
        >
          <span class="material-symbols-outlined">logout</span>
          <span v-if="sidebarOpen" class="font-medium">Logout</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto">
      <!-- Header -->
      <header
        class="h-16 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between px-8"
      >
        <h1 class="text-xl font-bold text-stone-900 dark:text-white">
          {{ route.meta.title || 'Admin Panel' }}
        </h1>
        <div class="flex items-center gap-4">
          <span class="text-sm text-stone-600 dark:text-stone-400">
            {{
              new Date().toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })
            }}
          </span>
        </div>
      </header>

      <!-- Content -->
      <div class="p-8">
        <router-view />
      </div>
    </main>
  </div>
</template>
