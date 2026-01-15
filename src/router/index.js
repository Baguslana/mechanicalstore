import { createRouter, createWebHistory } from 'vue-router'
import { useAdminStore } from '../stores/admin'
import HomeView from '../views/HomeView.vue'
import ProductsView from '../views/ProductsView.vue'
import AdminLoginView from '../views/AdminLoginView.vue'
import AdminLayout from '../views/AdminLayout.vue'
import AdminProductsView from '../views/AdminProductsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/products',
      name: 'products',
      component: ProductsView,
    },
    {
      path: '/admin/login',
      name: 'admin-login',
      component: AdminLoginView,
    },
    {
      path: '/admin',
      component: AdminLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          redirect: '/admin/products',
        },
        {
          path: 'products',
          name: 'admin-products',
          component: AdminProductsView,
          meta: { title: 'Products Management' },
        },
        // {
        //   path: 'categories',
        //   name: 'admin-categories',
        //   component: () => import('../views/AdminCategoriesView.vue'),
        //   meta: { title: 'Categories Management' },
        // },
      ],
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0, behavior: 'smooth' }
    }
  },
})

// Navigation guard for admin routes
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    const adminStore = useAdminStore()
    if (!adminStore.isAuthenticated) {
      next('/admin/login')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
