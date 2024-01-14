import { defineStore } from 'pinia'

export const useUsersStore = defineStore('users', {
  state: () => ({
    users: [],
  }),

  getters: {
    getUsers() {
      return this.users
    },
  },

  actions: {
    setUsers(users) {
      if (users && users.length) {
        const existingUsers = this.users
        const newUsers = users.filter((user) => !existingUsers.some((u) => u.id === user.id))
        this.users = [...existingUsers, ...newUsers]
      }
    },
    addUser(user) {
      if (!this.users.some((u) => u.id === user.id)) {
        this.users.push(user)
      }
    },
    removeUser(id) {
      const filtered = this.users.filter((user) => user.id !== id)
      this.users = filtered
    },
    updateUser(user) {
      const index = this.users.findIndex((u) => u.id === user.id)
      if (index >= 0) {
        this.users[index] = user
      }
    },
  },
})
