<script setup>
import { useAuthStore } from '@/stores/auth'
import { useQuery } from '@vue/apollo-composable'
import { gql } from 'graphql-tag'
import { ref, watch } from 'vue'

const authStore = useAuthStore()
const ALL_LOCATIONS_QUERY = gql`
  query {
    locations {
      id
      name
      locationCode
    }
  }
`

const { result } = useQuery(ALL_LOCATIONS_QUERY, null, {
  context: {
    headers: {
      Authorization: `Bearer ${authStore.token}`,
    },
  },
})

const locations = ref([])

watch(result, (newVal, oldVal) => {
  console.log('Result changed:', newVal, oldVal)
  if (newVal && newVal.locations) {
    locations.value = newVal.locations
  }
})
</script>

<template>
  <main>
    <div v-for="location in locations" :key="location.id">
      {{ location.name }}
    </div>
  </main>
</template>
