<script setup>
import { io } from 'socket.io-client'
import { ref, watch } from 'vue'
import { RouterView } from 'vue-router'
import { OWNED_EVENT_COLOR, PARTICIPATED_EVENT_COLOR, WS_API_URL } from './config'
import { useAuthStore } from './stores/auth'
import { useEventsStore } from './stores/events'

const authStore = useAuthStore()
const socket = ref(null)
const eventsStore = useEventsStore()

watch(authStore, () => {
  if (authStore.token && !socket.value) {
    socket.value = io(WS_API_URL, {
      extraHeaders: {
        Authorization: `Bearer ${authStore.token}`,
      },
    })
  }
})

watch(socket, (socket) => {
  if (socket) {
    console.log('listening to socket events')
    socket.on('connect', () => {
      console.log('connected')
    })

    socket.on('disconnect', () => {
      console.log('disconnected')
    })

    socket.on('event:updated', (event) => {
      console.log('event:updated', event)
      eventsStore.updateEvent({
        ...event,
        start: new Date(event.startDate),
        end: new Date(event.endDate),
        backgroundColor:
          event.createdBy.id === authStore.user.id ? OWNED_EVENT_COLOR : PARTICIPATED_EVENT_COLOR,
      })
    })

    socket.on('event:deleted', (event) => {
      console.log('event:deleted', event)
      eventsStore.removeEvent({
        ...event,
        start: new Date(event.startDate),
        end: new Date(event.endDate),
        backgroundColor:
          event.createdBy.id === authStore.user.id ? OWNED_EVENT_COLOR : PARTICIPATED_EVENT_COLOR,
      })
    })

    socket.on('event:created', (event) => {
      console.log('event:created', event)
      eventsStore.addSingleEvent({
        ...event,
        start: new Date(event.startDate),
        end: new Date(event.endDate),
        backgroundColor:
          event.createdBy.id === authStore.user.id ? OWNED_EVENT_COLOR : PARTICIPATED_EVENT_COLOR,
      })
    })
  }
})
</script>

<template>
  <RouterView />
</template>

<style scoped></style>
