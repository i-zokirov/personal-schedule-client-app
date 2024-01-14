<script setup>
import { ALL_LOCATIONS_QUERY, ALL_USERS_QUERY, FIND_MANY_EVENTS_QUERY } from '@/apollo/queries'
import CreateEventForm from '@/components/CreateEventForm.vue'
import EditEventForm from '@/components/EditEventForm.vue'
import NavbarComponent from '@/components/NavbarComponent.vue'
import { OWNED_EVENT_COLOR, PARTICIPATED_EVENT_COLOR } from '@/config'
import { useAuthStore } from '@/stores/auth'
import { useEventsStore } from '@/stores/events'
import { useUsersStore } from '@/stores/users'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import FullCalendar from '@fullcalendar/vue3'
import { useQuery } from '@vue/apollo-composable'
import { ref, watch } from 'vue'

const eventsStore = useEventsStore()
const authStore = useAuthStore()
const usersStore = useUsersStore()

const getEvents = (variables) => {
  return useQuery(FIND_MANY_EVENTS_QUERY, variables, {
    context: {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    },
  })
}

const variables = ref({
  input: {
    from: '2024-01-01',
    to: '2024-01-31',
    limit: 100,
    page: 1,
  },
})

const { result: eventsResult } = getEvents(variables.value)

const { result } = useQuery(ALL_LOCATIONS_QUERY, null, {
  context: {
    headers: {
      Authorization: `Bearer ${authStore.token}`,
    },
  },
})

const { result: usersResult } = useQuery(ALL_USERS_QUERY, null, {
  context: {
    headers: {
      Authorization: `Bearer ${authStore.token}`,
    },
  },
})

const locations = ref([])
const events = ref([])
const calendarRef = ref(null)
const open = ref(false)
const currentEvent = ref(null)
const openEditEventForm = ref(Boolean(currentEvent.value))

const closeEditEventForm = () => {
  currentEvent.value = null
  openEditEventForm.value = false
}

const close = () => {
  open.value = false
}

const handleOpen = () => {
  open.value = true
}

watch(eventsResult, (newVal) => {
  if (newVal && newVal.events) {
    const formatted = newVal.events.data.map((event) => {
      return {
        ...event,
        id: event.id,
        title: event.title,
        start: new Date(event.startDate),
        end: new Date(event.endDate),
        backgroundColor:
          event.createdBy.id === authStore.user.id ? OWNED_EVENT_COLOR : PARTICIPATED_EVENT_COLOR,
      }
    })

    eventsStore.addEvents(formatted)
  }
})

watch(usersResult, () => {
  if (usersResult.value && usersResult.value.users) {
    console.log(usersResult.value.users)
    usersStore.setUsers(usersResult.value.users)
  }
})

watch(eventsStore, () => {
  if (calendarRef.value) {
    const calendarApi = calendarRef.value.getApi()
    calendarApi.removeAllEventSources()
    calendarApi.addEventSource(eventsStore.events)
  }
})

watch(result, (newVal) => {
  if (newVal && newVal.locations) {
    locations.value = newVal.locations
  }
})

watch(events, (newVal) => {
  if (newVal) {
    console.log(newVal)
  }
})

watch(currentEvent, (newVal) => {
  if (newVal) {
    openEditEventForm.value = true
  }
})

const handleEventClick = (info) => {
  const event = eventsStore.getEvent(info.event.id)
  if (event) {
    console.log(event)
    currentEvent.value = event
  }
}

const calendarOptions = {
  plugins: [
    dayGridPlugin,
    timeGridPlugin,
    interactionPlugin, // needed for dateClick
  ],
  headerToolbar: {
    center: 'dayGridMonth,timeGridWeek,timeGridDay',
    right: 'prev,next,today',
  },
  initialView: 'dayGridMonth',
  editable: true,
  selectable: true,
  eventDisplay: 'block',
  eventResizableFromStart: true,
  eventClick: handleEventClick,
}
</script>

<template>
  <main>
    <NavbarComponent />
    <CreateEventForm :open="open" :close="close" :locations="locations" />
    <EditEventForm
      :open="openEditEventForm"
      :close="closeEditEventForm"
      :locations="locations"
      :currentEvent="currentEvent"
    />
    <div class="p-6 lg:px-8">
      <button
        type="button"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
        @click="handleOpen"
      >
        Create Event
      </button>

      <FullCalendar ref="calendarRef" :options="calendarOptions">
        <template v-slot:eventContent="arg">
          <b>{{ arg.timeText }}</b>
          <i>{{ arg.event.title }}</i>
        </template>
      </FullCalendar>

      <div>
        <h2 class="text-lg leading-6 font-medium text-gray-900">Locations</h2>
        <div class="mt-1 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div
            v-for="location in locations"
            :key="location.id"
            class="bg-white overflow-hidden shadow rounded-lg"
          >
            <div class="px-4 py-5 sm:p-6">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Name</dt>
                <dd class="mt-1 text-sm text-gray-900 truncate">{{ location.name }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
