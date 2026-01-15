import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  // State
  const items = ref([])
  const isCartOpen = ref(false)

  // Load cart from localStorage on init
  const loadCart = () => {
    try {
      const savedCart = localStorage.getItem('mechkey_cart')
      if (savedCart) {
        items.value = JSON.parse(savedCart)
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error)
      items.value = []
    }
  }

  // Save cart to localStorage
  const saveCart = () => {
    try {
      localStorage.setItem('mechkey_cart', JSON.stringify(items.value))
    } catch (error) {
      console.error('Error saving cart to localStorage:', error)
    }
  }

  // Computed: Total items count
  const itemCount = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0)
  })

  // Computed: Total price
  const totalPrice = computed(() => {
    return items.value.reduce((total, item) => total + item.price * item.quantity, 0)
  })

  // Computed: Formatted total price
  const formattedTotal = computed(() => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(totalPrice.value)
  })

  // Check if product is in cart
  const isInCart = (productId) => {
    return items.value.some((item) => item.id === productId)
  }

  // Get item quantity
  const getItemQuantity = (productId) => {
    const item = items.value.find((item) => item.id === productId)
    return item ? item.quantity : 0
  }

  // Add item to cart
  const addItem = (product, quantity = 1) => {
    const existingItem = items.value.find((item) => item.id === product.id)

    if (existingItem) {
      // Update quantity if item already exists
      existingItem.quantity += quantity

      // Check stock limit
      if (product.stock_quantity && existingItem.quantity > product.stock_quantity) {
        existingItem.quantity = product.stock_quantity
        return {
          success: false,
          message: `Maximum stock (${product.stock_quantity}) reached`,
        }
      }
    } else {
      // Add new item
      items.value.push({
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        image: product.image,
        category: product.category.name,
        quantity: quantity,
        stock_quantity: product.stock_quantity,
        in_stock: product.in_stock,
      })
    }

    saveCart()
    return {
      success: true,
      message: `${product.name} added to cart`,
    }
  }

  // Remove item from cart
  const removeItem = (productId) => {
    const index = items.value.findIndex((item) => item.id === productId)
    if (index > -1) {
      const removedItem = items.value[index]
      items.value.splice(index, 1)
      saveCart()
      return {
        success: true,
        message: `${removedItem.name} removed from cart`,
      }
    }
    return {
      success: false,
      message: 'Item not found in cart',
    }
  }

  // Update item quantity
  const updateQuantity = (productId, quantity) => {
    const item = items.value.find((item) => item.id === productId)
    if (item) {
      if (quantity <= 0) {
        removeItem(productId)
        return
      }

      // Check stock limit
      if (item.stock_quantity && quantity > item.stock_quantity) {
        quantity = item.stock_quantity
      }

      item.quantity = quantity
      saveCart()
    }
  }

  // Increment item quantity
  const incrementQuantity = (productId) => {
    const item = items.value.find((item) => item.id === productId)
    if (item) {
      if (item.stock_quantity && item.quantity >= item.stock_quantity) {
        return {
          success: false,
          message: `Maximum stock (${item.stock_quantity}) reached`,
        }
      }
      item.quantity++
      saveCart()
      return { success: true }
    }
  }

  // Decrement item quantity
  const decrementQuantity = (productId) => {
    const item = items.value.find((item) => item.id === productId)
    if (item) {
      if (item.quantity > 1) {
        item.quantity--
        saveCart()
      } else {
        removeItem(productId)
      }
    }
  }

  // Clear entire cart
  const clearCart = () => {
    items.value = []
    saveCart()
  }

  // Toggle cart sidebar
  const toggleCart = () => {
    isCartOpen.value = !isCartOpen.value
  }

  const openCart = () => {
    isCartOpen.value = true
  }

  const closeCart = () => {
    isCartOpen.value = false
  }

  // Initialize cart from localStorage
  loadCart()

  return {
    // State
    items,
    isCartOpen,

    // Computed
    itemCount,
    totalPrice,
    formattedTotal,

    // Methods
    isInCart,
    getItemQuantity,
    addItem,
    removeItem,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    clearCart,
    toggleCart,
    openCart,
    closeCart,
  }
})
