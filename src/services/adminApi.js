import api from './api'

/**
 * Admin Products API
 */
export const adminProductsApi = {
  /**
   * Create new product
   */
  create: async (productData) => {
    try {
      const response = await api.post('/admin/products', productData)
      return response.data
    } catch (error) {
      console.error('Error creating product:', error)
      throw error
    }
  },

  /**
   * Update product
   */
  update: async (productId, productData) => {
    try {
      const response = await api.put(`/admin/products/${productId}`, productData)
      return response.data
    } catch (error) {
      console.error('Error updating product:', error)
      throw error
    }
  },

  /**
   * Delete product
   */
  delete: async (productId) => {
    try {
      const response = await api.delete(`/admin/products/${productId}`)
      return response.data
    } catch (error) {
      console.error('Error deleting product:', error)
      throw error
    }
  },

  /**
   * Bulk update stock
   */
  bulkUpdateStock: async (updates) => {
    try {
      const response = await api.post('/admin/products/bulk-update-stock', { updates })
      return response.data
    } catch (error) {
      console.error('Error bulk updating stock:', error)
      throw error
    }
  },
}

/**
 * Admin Categories API
 */
export const adminCategoriesApi = {
  /**
   * Create new category
   */
  create: async (categoryData) => {
    try {
      const response = await api.post('/admin/categories', categoryData)
      return response.data
    } catch (error) {
      console.error('Error creating category:', error)
      throw error
    }
  },

  /**
   * Update category
   */
  update: async (categoryId, categoryData) => {
    try {
      const response = await api.put(`/admin/categories/${categoryId}`, categoryData)
      return response.data
    } catch (error) {
      console.error('Error updating category:', error)
      throw error
    }
  },

  /**
   * Delete category
   */
  delete: async (categoryId) => {
    try {
      const response = await api.delete(`/admin/categories/${categoryId}`)
      return response.data
    } catch (error) {
      console.error('Error deleting category:', error)
      throw error
    }
  },
}
