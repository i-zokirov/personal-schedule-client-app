import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      beforeEnter: (to, from, next) => {
        const authStore = useAuthStore()
        if (!authStore.initialized) {
          next({ name: 'checkauth' })
        } else if (!authStore.user || !authStore.token) {
          next({ name: 'login' })
        } else {
          next()
        }
      },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      beforeEnter: (to, from, next) => {
        const authStore = useAuthStore()
        if (!authStore.initialized) {
          next({ name: 'checkauth' })
        } else if (authStore.user && authStore.token) {
          next({ name: 'home' })
        } else {
          next()
        }
      },
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('../views/SignUpView.vue'),
      beforeEnter: (to, from, next) => {
        const authStore = useAuthStore()
        if (!authStore.initialized) {
          next({ name: 'checkauth' })
        } else if (authStore.user && authStore.token) {
          next({ name: 'home' })
        } else {
          next()
        }
      },
    },
    {
      path: '/checkauth',
      name: 'checkauth',
      component: () => import('../views/AuthStateCheck.vue'),
      beforeEnter: (to, from, next) => {
        const authStore = useAuthStore()
        if (authStore.user && authStore.token) {
          next({ name: 'home' })
        } else if (authStore.initialized) {
          next({ name: 'login' })
        } else {
          next()
        }
      },
    },
  ],
})

export default router
