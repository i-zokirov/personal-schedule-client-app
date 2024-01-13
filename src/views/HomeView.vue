<script setup>
import NavbarComponent from '@/components/NavbarComponent.vue'
import { useAuthStore } from '@/stores/auth'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import FullCalendar from '@fullcalendar/vue3'
import { useQuery } from '@vue/apollo-composable'
import { gql } from 'graphql-tag'
import { nextTick, ref, watch } from 'vue'

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

const FIND_MANY_EVENTS_QUERY = gql`
  query FindManyEvents($input: FindManyArgsInput) {
    events(findManyArgsInput: $input) {
      data {
        id
        title
        description
        startDate
        endDate
        location {
          id
          name
        }
        createdBy {
          id
          firstName
          lastName
        }
        createdAt
        updatedAt
      }
      meta {
        page
        limit
        total
      }
    }
  }
`

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
    limit: 10,
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

const locations = ref([])
const events = ref([])
const calendarRef = ref(null)

watch(eventsResult, (newVal) => {
  if (newVal && newVal.events) {
    const formatted = newVal.events.data.map((event) => {
      return {
        ...event,
        id: event.id,
        title: event.title,
        start: new Date(event.startDate),
        end: new Date(event.endDate),
      }
    })

    if (calendarRef.value) {
      const calendarApi = calendarRef.value.getApi()
      calendarApi.removeAllEventSources()
      calendarApi.addEventSource(formatted)
    }

    nextTick(() => {
      events.value = [...formatted]
    })
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
}
</script>

<template>
  <main>
    <NavbarComponent />
    <div class="p-6 lg:px-8">
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
