<script setup>
import { ref, onMounted, computed } from 'vue'
import { productsApi, categoriesApi } from '../services/api'
import api from '../services/api'

const products = ref([])
const categories = ref([])
const loading = ref(false)
const formLoading = ref(false)
const searchQuery = ref('')
const selectedCategory = ref('All Products')

// Modal states
const showModal = ref(false)
const modalMode = ref('create') // 'create' or 'edit'
const editingProduct = ref(null)

// Form data
const form = ref({
  name: '',
  slug: '',
  category_id: '',
  price: 0,
  image: '',
  description: '',
  in_stock: true,
  stock_quantity: 0,
})

onMounted(async () => {
  await loadProducts()
  await loadCategories()
})

const loadProducts = async () => {
  loading.value = true
  try {
    const data = await productsApi.getAll({
      category: selectedCategory.value !== 'All Products' ? selectedCategory.value : null,
      search: searchQuery.value || null,
    })
    products.value = Array.isArray(data) ? data : data.data || []
  } catch (error) {
    console.error('Error loading products:', error)
    alert('Failed to load products')
  } finally {
    loading.value = false
  }
}

const loadCategories = async () => {
  try {
    const data = await categoriesApi.getAll()
    categories.value = data
  } catch (error) {
    console.error('Error loading categories:', error)
  }
}

const filteredProducts = computed(() => {
  return products.value
})

const openCreateModal = () => {
  modalMode.value = 'create'
  form.value = {
    name: '',
    slug: '',
    category_id: categories.value[0]?.id || '',
    price: 0,
    image: '',
    description: '',
    in_stock: true,
    stock_quantity: 0,
  }
  showModal.value = true
}

const openEditModal = (product) => {
  modalMode.value = 'edit'
  editingProduct.value = product

  // Get category ID from product
  const categoryId =
    categories.value.find((c) => c.name === product.category.name)?.id || product.category.id

  form.value = {
    name: product.name,
    slug: product.slug,
    category_id: categoryId,
    price: product.price,
    image: product.image,
    description: product.description,
    in_stock: product.in_stock,
    stock_quantity: product.stock_quantity,
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingProduct.value = null
  formLoading.value = false
}

const generateSlug = () => {
  if (form.value.name) {
    form.value.slug = form.value.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }
}

const handleSubmit = async () => {
  formLoading.value = true

  try {
    if (modalMode.value === 'create') {
      // Create new product
      const response = await api.post('/admin/products', form.value)

      if (response.data.success) {
        alert('✅ Product created successfully!')
        await loadProducts()
        closeModal()
      } else {
        alert('❌ Failed to create product: ' + response.data.message)
      }
    } else {
      // Update existing product
      const response = await api.put(`/admin/products/${editingProduct.value.id}`, form.value)

      if (response.data.success) {
        alert('✅ Product updated successfully!')
        await loadProducts()
        closeModal()
      } else {
        alert('❌ Failed to update product: ' + response.data.message)
      }
    }
  } catch (error) {
    console.error('Error submitting form:', error)
    const errorMessage = error.response?.data?.message || error.message
    const errors = error.response?.data?.errors

    if (errors) {
      const errorList = Object.values(errors).flat().join('\n')
      alert('❌ Validation Error:\n' + errorList)
    } else {
      alert('❌ Error: ' + errorMessage)
    }
  } finally {
    formLoading.value = false
  }
}

const handleDelete = async (product) => {
  if (!confirm(`Are you sure you want to delete "${product.name}"?`)) {
    return
  }

  try {
    const response = await api.delete(`/admin/products/${product.id}`)

    if (response.data.success) {
      alert('✅ ' + response.data.message)
      await loadProducts()
    } else {
      alert('❌ Failed to delete product: ' + response.data.message)
    }
  } catch (error) {
    console.error('Error deleting product:', error)
    alert('❌ Error: ' + (error.response?.data?.message || error.message))
  }
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price)
}
</script>

<template>
  <div>
    <!-- Header Actions -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-2xl font-bold text-stone-900 dark:text-white">Products</h2>
        <p class="text-sm text-stone-600 dark:text-stone-400 mt-1">Manage your product inventory</p>
      </div>
      <button
        @click="openCreateModal"
        class="bg-primary text-white font-medium px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
      >
        <span class="material-symbols-outlined">add</span>
        <span>Add Product</span>
      </button>
    </div>

    <!-- Filters -->
    <div
      class="bg-white dark:bg-stone-900 rounded-xl p-6 mb-6 border border-stone-200 dark:border-stone-800"
    >
      <div class="flex flex-col md:flex-row gap-4">
        <!-- Search -->
        <div class="flex-1">
          <input
            v-model="searchQuery"
            @input="loadProducts"
            type="text"
            placeholder="Search products..."
            class="w-full px-4 py-3 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800 text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <!-- Category Filter -->
        <select
          v-model="selectedCategory"
          @change="loadProducts"
          class="px-4 py-3 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option>All Products</option>
          <option v-for="category in categories" :key="category.id">
            {{ category.name }}
          </option>
        </select>
      </div>
    </div>

    <!-- Products Table -->
    <div
      class="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 overflow-hidden"
    >
      <!-- Loading State -->
      <div v-if="loading" class="p-12 text-center">
        <span
          class="material-symbols-outlined text-6xl text-stone-300 dark:text-stone-700 animate-spin"
          >refresh</span
        >
        <p class="text-stone-600 dark:text-stone-400 mt-4">Loading products...</p>
      </div>

      <!-- Table -->
      <div v-else-if="filteredProducts.length > 0" class="overflow-x-auto">
        <table class="w-full">
          <thead
            class="bg-stone-50 dark:bg-stone-800 border-b border-stone-200 dark:border-stone-700"
          >
            <tr>
              <th class="text-left px-6 py-4 text-sm font-semibold text-stone-900 dark:text-white">
                Product
              </th>
              <th class="text-left px-6 py-4 text-sm font-semibold text-stone-900 dark:text-white">
                Category
              </th>
              <th class="text-left px-6 py-4 text-sm font-semibold text-stone-900 dark:text-white">
                Price
              </th>
              <th class="text-left px-6 py-4 text-sm font-semibold text-stone-900 dark:text-white">
                Stock
              </th>
              <th class="text-left px-6 py-4 text-sm font-semibold text-stone-900 dark:text-white">
                Status
              </th>
              <th class="text-right px-6 py-4 text-sm font-semibold text-stone-900 dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-stone-200 dark:divide-stone-800">
            <tr
              v-for="product in filteredProducts"
              :key="product.id"
              class="hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors"
            >
              <!-- Product -->
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <img
                    :src="product.image"
                    :alt="product.name"
                    class="w-12 h-12 rounded-lg object-cover bg-stone-100 dark:bg-stone-800"
                  />
                  <div>
                    <p class="font-medium text-stone-900 dark:text-white">{{ product.name }}</p>
                    <p class="text-sm text-stone-500 dark:text-stone-400">{{ product.slug }}</p>
                  </div>
                </div>
              </td>

              <!-- Category -->
              <td class="px-6 py-4">
                <span
                  class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300"
                >
                  {{ product.category.name }}
                </span>
              </td>

              <!-- Price -->
              <td class="px-6 py-4">
                <p class="font-medium text-stone-900 dark:text-white">
                  {{ formatPrice(product.price) }}
                </p>
              </td>

              <!-- Stock -->
              <td class="px-6 py-4">
                <p class="text-stone-900 dark:text-white">{{ product.stock_quantity }}</p>
              </td>

              <!-- Status -->
              <td class="px-6 py-4">
                <span
                  :class="[
                    'inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium',
                    product.in_stock
                      ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                      : 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400',
                  ]"
                >
                  <span
                    class="w-1.5 h-1.5 rounded-full"
                    :class="product.in_stock ? 'bg-green-500' : 'bg-red-500'"
                  ></span>
                  {{ product.in_stock ? 'In Stock' : 'Out of Stock' }}
                </span>
              </td>

              <!-- Actions -->
              <td class="px-6 py-4">
                <div class="flex items-center justify-end gap-2">
                  <button
                    @click="openEditModal(product)"
                    class="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-primary transition-colors"
                    title="Edit"
                  >
                    <span class="material-symbols-outlined text-xl">edit</span>
                  </button>
                  <button
                    @click="handleDelete(product)"
                    class="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors"
                    title="Delete"
                  >
                    <span class="material-symbols-outlined text-xl">delete</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-else class="p-12 text-center">
        <span class="material-symbols-outlined text-6xl text-stone-300 dark:text-stone-700 mb-4"
          >inventory_2</span
        >
        <h3 class="text-xl font-bold text-stone-900 dark:text-white mb-2">No products found</h3>
        <p class="text-stone-600 dark:text-stone-400 mb-6">
          Get started by adding your first product
        </p>
        <button
          @click="openCreateModal"
          class="bg-primary text-white font-medium px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
        >
          <span class="material-symbols-outlined">add</span>
          <span>Add Product</span>
        </button>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <Transition name="modal">
      <div
        v-if="showModal"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        @click.self="closeModal"
      >
        <div
          class="bg-white dark:bg-stone-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <!-- Modal Header -->
          <div
            class="flex items-center justify-between p-6 border-b border-stone-200 dark:border-stone-800 sticky top-0 bg-white dark:bg-stone-900 z-10"
          >
            <h3 class="text-xl font-bold text-stone-900 dark:text-white">
              {{ modalMode === 'create' ? 'Add New Product' : 'Edit Product' }}
            </h3>
            <button
              @click="closeModal"
              :disabled="formLoading"
              class="h-10 w-10 flex items-center justify-center rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 disabled:opacity-50"
            >
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <!-- Modal Body -->
          <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
            <!-- Name -->
            <div>
              <label class="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                Product Name *
              </label>
              <input
                v-model="form.name"
                @input="generateSlug"
                type="text"
                required
                :disabled="formLoading"
                placeholder="e.g., TOFU65 Acrylic"
                class="w-full px-4 py-3 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800 text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
              />
            </div>

            <!-- Slug -->
            <div>
              <label class="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                Slug *
              </label>
              <input
                v-model="form.slug"
                type="text"
                required
                :disabled="formLoading"
                placeholder="e.g., tofu65-acrylic"
                class="w-full px-4 py-3 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800 text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
              />
            </div>

            <!-- Category & Price -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                  Category *
                </label>
                <select
                  v-model="form.category_id"
                  required
                  :disabled="formLoading"
                  class="w-full px-4 py-3 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                >
                  <option value="">Select category</option>
                  <option v-for="category in categories" :key="category.id" :value="category.id">
                    {{ category.name }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                  Price (IDR) *
                </label>
                <input
                  v-model.number="form.price"
                  type="number"
                  required
                  min="0"
                  :disabled="formLoading"
                  placeholder="0"
                  class="w-full px-4 py-3 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800 text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                />
              </div>
            </div>

            <!-- Image URL -->
            <div>
              <label class="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                Image URL *
              </label>
              <input
                v-model="form.image"
                type="url"
                required
                :disabled="formLoading"
                placeholder="https://example.com/image.jpg"
                class="w-full px-4 py-3 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800 text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
              />
            </div>

            <!-- Description -->
            <div>
              <label class="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                Description *
              </label>
              <textarea
                v-model="form.description"
                required
                :disabled="formLoading"
                rows="4"
                placeholder="Product description..."
                class="w-full px-4 py-3 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800 text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-primary resize-none disabled:opacity-50"
              ></textarea>
            </div>

            <!-- Stock Quantity & In Stock -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                  Stock Quantity *
                </label>
                <input
                  v-model.number="form.stock_quantity"
                  type="number"
                  required
                  min="0"
                  :disabled="formLoading"
                  placeholder="0"
                  class="w-full px-4 py-3 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800 text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                  Status
                </label>
                <label
                  class="flex items-center gap-3 px-4 py-3 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800 cursor-pointer"
                >
                  <input
                    v-model="form.in_stock"
                    type="checkbox"
                    :disabled="formLoading"
                    class="w-5 h-5 rounded border-stone-300 dark:border-stone-700 text-primary focus:ring-primary disabled:opacity-50"
                  />
                  <span class="text-stone-900 dark:text-white font-medium">In Stock</span>
                </label>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-3 pt-4 border-t border-stone-200 dark:border-stone-800">
              <button
                type="button"
                @click="closeModal"
                :disabled="formLoading"
                class="flex-1 px-6 py-3 rounded-lg border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 font-medium hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="formLoading"
                class="flex-1 px-6 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <span v-if="formLoading" class="material-symbols-outlined animate-spin"
                  >refresh</span
                >
                <span>{{ modalMode === 'create' ? 'Create Product' : 'Update Product' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
