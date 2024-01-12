<template>
  <div class="flex items-center justify-center h-full">
    <p class="text-center">Loading ...</p>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()
export default {
  mounted() {
    authStore
      .initialize()
      .then(() => {
        if (authStore.user) {
          this.$router.push({ name: 'home' })
        } else {
          this.$router.push({ name: 'login' })
        }
      })
      .catch(() => {
        this.$router.push({ name: 'login' })
      })
  },
}
</script>

<style scoped></style>
