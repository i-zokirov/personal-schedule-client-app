<script setup>
import DialogComponent from '@/components/DialogComponent.vue'
import { useAuthStore } from '@/stores/auth'
import { useEventsStore } from '@/stores/events'
import { useMutation } from '@vue/apollo-composable'
import { gql } from 'graphql-tag'
import { ref, toRefs, watch } from 'vue'
import * as Yup from 'yup'

const props = defineProps({
  open: Boolean,
  close: Function,
  locations: Array,
  currentEvent: Object,
})

const validationSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  description: Yup.string(),
  location: Yup.string(),
  startDate: Yup.string().required('Start Date is required'),
  endDate: Yup.string().required('End Date is required'),
})

let { currentEvent } = toRefs(props)

const values = ref({
  title: '',
  description: '',
  location: '',
  startDate: '',
  endDate: '',
})

watch(
  currentEvent,
  (newVal) => {
    if (newVal) {
      values.value = {
        title: currentEvent.value.title,
        description: currentEvent.value.description,
        location: currentEvent.value.location?.id ?? '',
        startDate: currentEvent.value.start.toISOString().slice(0, -8),
        endDate: currentEvent.value.end.toISOString().slice(0, -8),
      }
    }
  },
  { immediate: true }
)

const errors = ref({})

const validate = (field) => {
  validationSchema
    .validateAt(field, values.value)
    .then(() => (errors.value[field] = ''))
    .catch((err) => {
      errors.value[err.path] = err.message
    })
}

const authStore = useAuthStore()
const eventsStore = useEventsStore()

const UPDATE_EVENT_MUTATION = gql`
  mutation UpdateEvent($input: UpdateEventInput!) {
    updateEvent(updateEventInput: $input) {
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
  }
`

const { mutate } = useMutation(UPDATE_EVENT_MUTATION, {
  context: {
    headers: {
      Authorization: `Bearer ${authStore.token}`,
    },
  },
  variables: {
    input: {
      id: currentEvent.value?.id ?? '',
      title: values.value.title,
      description: values.value.description,
      startDate: values.value.startDate,
      endDate: values.value.endDate,
    },
  },
})

const handleSubmit = async () => {
  try {
    await validationSchema.validate(values.value, { abortEarly: false })

    const response = await mutate({
      input: {
        id: currentEvent.value.id,
        title: values.value.title,
        description: values.value.description,
        startDate: values.value.startDate,
        endDate: values.value.endDate,
      },
    })

    if (response) {
      eventsStore.updateEvent({
        ...response.data.updateEvent,
        start: new Date(response.data.updateEvent.startDate),
        end: new Date(response.data.updateEvent.endDate),
      })
    }

    props.close()
  } catch (err) {
    if (err.inner) {
      err.inner.forEach((e) => {
        errors.value[e.path] = e.message
      })
    } else {
      const errormessage =
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : err.message

      console.log(err)
      alert(errormessage)
      // Handle error logic here
    }
  }
}

defineEmits(['close'])

// Watch for changes in values.title and call validate
watch(
  () => values.value.title,
  () => {
    validate('title')
  }
)

// Watch for changes in values.description and call validate
watch(
  () => values.value.description,
  () => {
    validate('description')
  }
)

// Watch for changes in values.location and call validate
watch(
  () => values.value.location,
  () => {
    validate('location')
  }
)

// Watch for changes in values.startDate and call validate
watch(
  () => values.value.startDate,
  () => {
    validate('startDate')
  }
)

// Watch for changes in values.endDate and call validate
watch(
  () => values.value.endDate,
  () => {
    validate('endDate')
  }
)
</script>

<template>
  <div>
    <DialogComponent :open="open" :close="close">
      <template #title>Edit Event </template>

      <template #body>
        <form action="#" @submit.prevent="handleSubmit" novalidate>
          <div class="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
            <div class="sm:col-span-3">
              <label for="title" class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                Title
              </label>
              <div class="mt-1 sm:mt-0 sm:col-span-2">
                <input
                  type="text"
                  name="title"
                  id="title"
                  autocomplete="title"
                  v-model="values.title"
                  class="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              <span class="text-red-500" v-if="errors.title">{{ errors.title }}</span>
            </div>

            <div class="sm:col-span-3">
              <label
                for="description"
                class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
              >
                Description
              </label>
              <div class="mt-1 sm:mt-0 sm:col-span-2">
                <textarea
                  id="description"
                  name="description"
                  rows="3"
                  v-model="values.description"
                  class="max-w-lg shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
                ></textarea>
              </div>
              <span class="text-red-500" v-if="errors.description">{{ errors.description }}</span>
            </div>

            <div class="sm:col-span-3">
              <label
                for="location"
                class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
              >
                Location
              </label>
              <div class="mt-1 sm:mt-0 sm:col-span-2">
                <select
                  id="location"
                  name="location"
                  v-model="values.location"
                  autocomplete="location"
                  class="max-w-lg block focus:ring-indigo-500 focus:border-indigo-500 w-full shadow-sm sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                >
                  <option>Select a location</option>
                  <option v-for="location in locations" :key="location.id" :value="location.id">
                    {{ location.name }}
                  </option>
                </select>
              </div>

              <span class="text-red-500" v-if="errors.location">{{ errors.location }}</span>
            </div>

            <div class="sm:col-span-3 flex justify-between">
              <div>
                <label
                  for="startDate"
                  class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                >
                  Start Date
                </label>
                <div class="mt-1 sm:mt-0 sm:col-span-2">
                  <input
                    type="datetime-local"
                    name="startDate"
                    id="startDate"
                    autocomplete="startDate"
                    v-model="values.startDate"
                    class="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <span class="text-red-500" v-if="errors.startDate">{{ errors.startDate }}</span>
              </div>
              <div>
                <label
                  for="endDate"
                  class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                >
                  End Date
                </label>
                <div class="mt-1 sm:mt-0 sm:col-span-2">
                  <input
                    type="datetime-local"
                    name="endDate"
                    id="endDate"
                    autocomplete="endDate"
                    v-model="values.endDate"
                    class="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <span class="text-red-500" v-if="errors.endDate">{{ errors.endDate }}</span>
              </div>
            </div>
          </div>

          <div class="sm:flex sm:flex-row-reverse sm:px-6 mt-4">
            <button
              type="button"
              class="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none"
              @click="close"
            >
              Close
            </button>

            <button
              type="submit"
              class="mr-3 inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none"
            >
              Save
            </button>
          </div>
        </form>
      </template>
    </DialogComponent>
  </div>
</template>

<style scoped>
/* Your component styles go here */
</style>
