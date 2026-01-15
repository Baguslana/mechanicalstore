import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAdminStore = defineStore('admin', () => {
  // State
  const isAuthenticated = ref(false)
  const adminUser = ref(null)

  // Load auth state from localStorage
  const loadAuth = () => {
    try {
      const savedAuth = localStorage.getItem('mechkey_admin_auth')
      if (savedAuth) {
        const auth = JSON.parse(savedAuth)
        isAuthenticated.value = auth.isAuthenticated
        adminUser.value = auth.user
      }
    } catch (error) {
      console.error('Error loading admin auth:', error)
    }
  }

  // Save auth state to localStorage
  const saveAuth = () => {
    try {
      localStorage.setItem(
        'mechkey_admin_auth',
        JSON.stringify({
          isAuthenticated: isAuthenticated.value,
          user: adminUser.value,
        }),
      )
    } catch (error) {
      console.error('Error saving admin auth:', error)
    }
  }

  // Login (Simple version - for demo)
  const login = (username, password) => {
    // TODO: Replace with real API call
    // For demo: admin/admin123
    if (username === 'admin' && password === 'admin123') {
      isAuthenticated.value = true
      adminUser.value = {
        username: 'admin',
        name: 'Administrator',
        email: 'admin@mechkey.com',
      }
      saveAuth()
      return { success: true }
    }
    return { success: false, message: 'Invalid credentials' }
  }

  // Logout
  const logout = () => {
    isAuthenticated.value = false
    adminUser.value = null
    localStorage.removeItem('mechkey_admin_auth')
  }

  // Check if user is admin
  const checkAuth = () => {
    return isAuthenticated.value
  }

  // Initialize
  loadAuth()

  return {
    // State
    isAuthenticated,
    adminUser,

    // Methods
    login,
    logout,
    checkAuth,
  }
})
