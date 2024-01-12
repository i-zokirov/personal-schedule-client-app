import apiUrl from '@/api'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    initialized: false,
  }),

  actions: {
    async login({ email, password }) {
      const response = await apiUrl.post('/auth/login', { email, password })
      console.log(response)
      if (response && response.data) {
        this.user = {
          id: response.data.id,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          name: response.data.firstName + ' ' + response.data.lastName,
          email: response.data.email,
        }
        this.token = response.data.access_token
        this.initialized = true
        // Save access_token to localStorage
        localStorage.setItem('access_token', response.data.access_token)
      }
    },

    async register({ firstName, lastName, email, password }) {
      const response = await apiUrl.post('/auth/signup', {
        firstName,
        lastName,
        email,
        password,
      })
      if (response && response.data) {
        this.user = {
          id: response.data.id,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          name: response.data.firstName + ' ' + response.data.lastName,
          email: response.data.email,
        }
        this.token = response.data.access_token
        this.initialized = true
        // Save access_token to localStorage
        localStorage.setItem('access_token', response.data.access_token)
      }
    },

    logout() {
      this.user = null
      this.token = null

      // Remove access_token from localStorage
      localStorage.removeItem('access_token')
    },

    async initialize() {
      this.initialized = true
      const token = localStorage.getItem('access_token')
      if (token) {
        this.token = token
        const response = await apiUrl.post(
          '/auth/me',
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        if (response && response.data) {
          this.user = {
            id: response.data.id,
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            name: response.data.firstName + ' ' + response.data.lastName,
            email: response.data.email,
          }
        } else {
          this.user = null
          this.token = null
          localStorage.removeItem('access_token')
        }
      }
    },
  },
})
