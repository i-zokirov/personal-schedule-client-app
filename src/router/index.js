import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '../stores/auth.js'

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
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('../views/SignUpView.vue'),
    },
    {
      path: '/checkauth',
      name: 'checkauth',
      component: () => import('../views/AuthStateCheck.vue'),
    },
  ],
})

export default router
