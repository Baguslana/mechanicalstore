import axios from 'axios'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
    Accept: 'application/json',
  },
  timeout: 10000, // 10 seconds
})

// Request interceptor (for auth tokens, etc)
api.interceptors.request.use(
  (config) => {
    // Add auth token if exists
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor (for error handling)
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle common errors
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('auth_token')
          // window.location.href = '/login'
          break
        case 404:
          console.error('Resource not found:', error.response.config.url)
          break
        case 500:
          console.error('Server error:', error.response.data)
          break
      }
    } else if (error.request) {
      console.error('No response from server')
    } else {
      console.error('Request error:', error.message)
    }
    return Promise.reject(error)
  },
)

/**
 * Products API
 */
export const productsApi = {
  /**
   * Get all products with filters
   * @param {Object} filters - Filter parameters
   * @returns {Promise<Array>} Array of products
   */
  getAll: async (filters = {}) => {
    try {
      const params = {
        category: filters.category,
        size: filters.size,
        switch_type: filters.switchType,
        profile: filters.profile,
        material: filters.material,
        accessory_type: filters.accessoryType,
        min_price: filters.minPrice,
        max_price: filters.maxPrice,
        in_stock_only: filters.inStockOnly ? 1 : 0,
        search: filters.search,
        sort_by: filters.sortBy || 'created_at',
        sort_order: filters.sortOrder || 'desc',
        paginate: filters.paginate ? 1 : 0,
        per_page: filters.perPage || 12,
      }

      // Remove undefined/null values
      Object.keys(params).forEach((key) => {
        if (params[key] === undefined || params[key] === null || params[key] === '') {
          delete params[key]
        }
      })

      const response = await api.get('/products', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching products:', error)
      throw error
    }
  },

  /**
   * Get single product by slug
   * @param {string} slug - Product slug
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Product details
   */
  getBySlug: async (slug, options = {}) => {
    try {
      const params = {
        include_related: options.includeRelated ? 1 : 0,
      }

      const response = await api.get(`/products/${slug}`, { params })
      return response.data
    } catch (error) {
      console.error(`Error fetching product ${slug}:`, error)
      throw error
    }
  },

  /**
   * Search products
   * @param {string} query - Search query
   * @returns {Promise<Array>} Array of matching products
   */
  search: async (query) => {
    try {
      const response = await api.get('/products', {
        params: { search: query },
      })
      return response.data
    } catch (error) {
      console.error('Error searching products:', error)
      throw error
    }
  },
}

/**
 * Categories API
 */
export const categoriesApi = {
  /**
   * Get all categories
   * @returns {Promise<Array>} Array of categories
   */
  getAll: async () => {
    try {
      const response = await api.get('/categories')
      return response.data.data || response.data
    } catch (error) {
      console.error('Error fetching categories:', error)
      throw error
    }
  },

  /**
   * Get filter options for a category
   * @param {string} categorySlug - Category slug
   * @returns {Promise<Object>} Filter options
   */
  getFilterOptions: async (categorySlug) => {
    try {
      const response = await api.get('/filter-options', {
        params: { category: categorySlug },
      })
      return response.data
    } catch (error) {
      console.error('Error fetching filter options:', error)
      throw error
    }
  },
}

/**
 * Helper functions
 */
export const helpers = {
  /**
   * Format price to IDR
   * @param {number} price - Price in number
   * @returns {string} Formatted price
   */
  formatPrice: (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
  },

  /**
   * Get stock status color
   * @param {Object} stockStatus - Stock status object from API
   * @returns {string} Tailwind color class
   */
  getStockColor: (stockStatus) => {
    const colorMap = {
      green: 'bg-green-500',
      yellow: 'bg-yellow-500',
      red: 'bg-red-500',
    }
    return colorMap[stockStatus?.color] || 'bg-gray-500'
  },

  /**
   * Build filter query for URL
   * @param {Object} filters - Filter object
   * @returns {string} Query string
   */
  buildQueryString: (filters) => {
    const params = new URLSearchParams()
    Object.keys(filters).forEach((key) => {
      if (
        filters[key] &&
        filters[key] !== 'All Products' &&
        filters[key] !== 'All Sizes' &&
        filters[key] !== 'All Types'
      ) {
        params.append(key, filters[key])
      }
    })
    return params.toString()
  },
}

// Export default api instance for custom requests
export default api
