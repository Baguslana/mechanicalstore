<script setup>
import { categories, sizes, switchTypes, priceRanges } from '../data/products.js'

const props = defineProps({
  selectedCategory: String,
  selectedSize: String,
  selectedSwitchType: String,
  selectedPriceRange: Object,
  showInStockOnly: Boolean,
})

const emit = defineEmits([
  'update:selectedCategory',
  'update:selectedSize',
  'update:selectedSwitchType',
  'update:selectedPriceRange',
  'update:showInStockOnly',
  'clearFilters',
])
</script>

<template>
  <aside class="space-y-6">
    <!-- Filter Header -->
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-bold text-stone-900 dark:text-white">Filters</h2>
      <button
        @click="emit('clearFilters')"
        class="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
      >
        Clear All
      </button>
    </div>

    <!-- Stock Filter -->
    <div class="pb-6 border-b border-stone-200 dark:border-stone-800">
      <label class="flex items-center gap-3 cursor-pointer group">
        <input
          type="checkbox"
          :checked="showInStockOnly"
          @change="emit('update:showInStockOnly', $event.target.checked)"
          class="w-5 h-5 rounded border-stone-300 dark:border-stone-700 text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer"
        />
        <span
          class="text-sm font-medium text-stone-700 dark:text-stone-300 group-hover:text-primary transition-colors"
        >
          In Stock Only
        </span>
      </label>
    </div>

    <!-- Category Filter -->
    <div class="pb-6 border-b border-stone-200 dark:border-stone-800">
      <h3 class="text-sm font-bold text-stone-900 dark:text-white mb-3">Category</h3>
      <div class="space-y-2">
        <button
          v-for="category in categories"
          :key="category"
          @click="emit('update:selectedCategory', category)"
          :class="[
            'w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all',
            selectedCategory === category
              ? 'bg-primary text-white'
              : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800',
          ]"
        >
          {{ category }}
        </button>
      </div>
    </div>

    <!-- Size Filter (for Keyboard Kits) -->
    <div
      v-if="selectedCategory === 'Keyboard Kits' || selectedCategory === 'All Products'"
      class="pb-6 border-b border-stone-200 dark:border-stone-800"
    >
      <h3 class="text-sm font-bold text-stone-900 dark:text-white mb-3">Keyboard Size</h3>
      <div class="space-y-2">
        <button
          v-for="size in sizes"
          :key="size"
          @click="emit('update:selectedSize', size)"
          :class="[
            'w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all',
            selectedSize === size
              ? 'bg-primary text-white'
              : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800',
          ]"
        >
          {{ size }}
        </button>
      </div>
    </div>

    <!-- Switch Type Filter (for Switches) -->
    <div
      v-if="selectedCategory === 'Switches' || selectedCategory === 'All Products'"
      class="pb-6 border-b border-stone-200 dark:border-stone-800"
    >
      <h3 class="text-sm font-bold text-stone-900 dark:text-white mb-3">Switch Type</h3>
      <div class="space-y-2">
        <button
          v-for="type in switchTypes"
          :key="type"
          @click="emit('update:selectedSwitchType', type)"
          :class="[
            'w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all',
            selectedSwitchType === type
              ? 'bg-primary text-white'
              : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800',
          ]"
        >
          {{ type }}
        </button>
      </div>
    </div>

    <!-- Price Range Filter -->
    <div>
      <h3 class="text-sm font-bold text-stone-900 dark:text-white mb-3">Price Range</h3>
      <div class="space-y-2">
        <button
          v-for="range in priceRanges"
          :key="range.label"
          @click="emit('update:selectedPriceRange', range)"
          :class="[
            'w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all',
            selectedPriceRange?.label === range.label
              ? 'bg-primary text-white'
              : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800',
          ]"
        >
          {{ range.label }}
        </button>
      </div>
    </div>
  </aside>
</template>
