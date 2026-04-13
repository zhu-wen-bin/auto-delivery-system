import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/h5/product/:id',
    name: 'ProductDetail',
    component: () => import('../views/ProductDetail.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    component: () => import('../components/AppLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: '/dashboard'
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        meta: { title: '统计页面' },
        component: () => import('../views/Dashboard.vue')
      },
      {
        path: 'products',
        name: 'Products',
        meta: { title: '商品列表' },
        component: () => import('../views/Products.vue')
      },
      {
        path: 'products/add',
        name: 'ProductAdd',
        meta: { title: '添加商品' },
        component: () => import('../views/ProductEdit.vue')
      },
      {
        path: 'products/edit/:id',
        name: 'ProductEdit',
        meta: { title: '编辑商品' },
        component: () => import('../views/ProductEdit.vue')
      },
      {
        path: 'orders',
        name: 'Orders',
        meta: { title: '订单列表' },
        component: () => import('../views/Orders.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    next('/login')
  } else if (to.path === '/login' && authStore.isLoggedIn) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
