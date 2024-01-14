<script setup>
import {
  ALL_LOCATIONS_QUERY,
  CREATE_LOCATION_MUTATION,
  DELETE_LOCATION_MUTATION,
  UPDATE_LOCATION_MUTATION,
} from '@/apollo/queries'
import NavbarComponent from '@/components/NavbarComponent.vue'
import THead from '@/components/table/THead.vue'
import TableComponent from '@/components/table/TableComponent.vue'
import { useAuthStore } from '@/stores/auth'
import { useLocationsStore } from '@/stores/locations'
import { useMutation, useQuery } from '@vue/apollo-composable'
import { ref, watch } from 'vue'
import * as Yup from 'yup'

const authStore = useAuthStore()
const locationsStore = useLocationsStore()
const currentLocation = ref(null)

const newLocationForm = ref({
  values: {
    name: '',
  },
  errors: {
    name: '',
  },
  loading: false,
})

const editLocationForm = ref({
  values: {
    name: '',
    id: '',
  },
  errors: {
    name: '',
  },
  loading: false,
})

const { result } = useQuery(ALL_LOCATIONS_QUERY, null, {
  context: {
    headers: {
      Authorization: `Bearer ${authStore.token}`,
    },
  },
})

const { mutate: createLocation } = useMutation(CREATE_LOCATION_MUTATION, {
  context: {
    headers: {
      Authorization: `Bearer ${authStore.token}`,
    },
  },
  variables: {
    input: {
      name: newLocationForm.value.values.name,
    },
  },
})

const { mutate: removeLocation } = useMutation(DELETE_LOCATION_MUTATION, {
  context: {
    headers: {
      Authorization: `Bearer ${authStore.token}`,
    },
  },
  variables: {
    id: '',
  },
})

const { mutate: updateLocation } = useMutation(UPDATE_LOCATION_MUTATION, {
  context: {
    headers: {
      Authorization: `Bearer ${authStore.token}`,
    },
  },
  variables: {
    input: {
      name: editLocationForm.value.values.name,
      id: '',
    },
  },
})

const validationSchema = Yup.object({
  name: Yup.string()
    .required('Location name is required')
    .min(3, 'Location name is too short')
    .max(50, 'Location name is too long')
    .matches(/^[a-zA-Z0-9 ]*$/, 'Location name must be alphanumeric'),
})

watch(newLocationForm.value.values, (values) => {
  validationSchema
    .validate(values, { abortEarly: false })
    .then(() => (newLocationForm.value.errors = {}))
    .catch((err) => {
      err.inner.forEach((error) => {
        newLocationForm.value.errors[error.path] = error.message
      })
    })
})

watch(editLocationForm.value.values, (values) => {
  validationSchema
    .validate(values, { abortEarly: false })
    .then(() => (editLocationForm.value.errors = {}))
    .catch((err) => {
      err.inner.forEach((error) => {
        editLocationForm.value.errors[error.path] = error.message
      })
    })
})

watch(result, () => {
  if (result.value) {
    locationsStore.addLocations(result.value.locations)
  }
})

const handleSubmit = () => {
  validationSchema
    .validate(newLocationForm.value.values, { abortEarly: false })
    .then(async () => {
      newLocationForm.value.errors = {}
      console.log('valid')
      try {
        newLocationForm.value.loading = true
        const created = await createLocation({
          input: {
            name: newLocationForm.value.values.name,
          },
        })

        newLocationForm.value.values.name = ''
        newLocationForm.value.errors = {}
        newLocationForm.value.loading = false
        locationsStore.addSingleLocation(created.data.createLocation)
      } catch (err) {
        const errormessage =
          err.response && err.response.data && err.response.data.message
            ? err.response.data.message
            : err.message
        newLocationForm.value.loading = false
        console.log(err)
        alert(errormessage)
      }
    })
    .catch((err) => {
      err.inner.forEach((error) => {
        newLocationForm.value.errors[error.path] = error.message
      })
    })
}

const handleSubmitEditForm = () => {
  validationSchema
    .validate(editLocationForm.value.values, { abortEarly: false })
    .then(async () => {
      editLocationForm.value.errors = {}
      console.log('valid')
      try {
        currentLocation.value = null
        editLocationForm.value.loading = true
        const updated = await updateLocation({
          input: {
            name: editLocationForm.value.values.name,
            id: editLocationForm.value.values.id,
          },
        })

        editLocationForm.value.values.name = ''
        editLocationForm.value.values.id = ''
        editLocationForm.value.errors = {}
        editLocationForm.value.loading = false
        locationsStore.updateLocation(updated.data.updateLocation)
      } catch (err) {
        const errormessage =
          err.response && err.response.data && err.response.data.message
            ? err.response.data.message
            : err.message
        editLocationForm.value.loading = false
        console.log(err)
        alert(errormessage)
      }
    })
    .catch((err) => {
      err.inner.forEach((error) => {
        editLocationForm.value.errors[error.path] = error.message
      })
    })
}

const handleSelect = (location) => {
  currentLocation.value = location.id
  editLocationForm.value.values.name = location.name
  editLocationForm.value.values.id = location.id
}

const handleDelete = async (id) => {
  try {
    await removeLocation({
      id: id,
    })
    locationsStore.removeLocationById(id)
  } catch (err) {
    const errormessage =
      err.response && err.response.data && err.response.data.message
        ? err.response.data.message
        : err.message
    newLocationForm.value.loading = false
    console.log(err)
    alert(errormessage)
  }
}
</script>

<template>
  <NavbarComponent />
  <div class="p-6 lg:px-8">
    <div class="flex justify-between my-10">
      <div class="">
        <h1 class="text-2xl font-semibold text-gray-700 dark:text-gray-600">Locations</h1>
      </div>
      <form novalidate @submit.prevent="handleSubmit">
        <label for="name" class="block text-sm font-medium leading-6 text-gray-900"
          >Add location</label
        >
        <div class="mt-2 flex space-between">
          <input
            id="name"
            name="name"
            type="text"
            autocomplete="name"
            placeholder="Location name"
            required=""
            :disabled="newLocationForm.loading"
            aria-required="true"
            v-model="newLocationForm.values.name"
            class="block w-120 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
          <button
            type="submit"
            :disabled="newLocationForm.loading"
            :class="[
              ' ml-5 flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
              newLocationForm.loading
                ? 'bg-gray-500 hover:bg-gray-500'
                : 'bg-indigo-600 hover:bg-indigo-500 focus-visible:outline-indigo-600',
            ]"
          >
            Submit
          </button>
        </div>
        <span class="text-red-500" v-if="newLocationForm.errors.name">{{
          newLocationForm.errors.name
        }}</span>
      </form>
    </div>
    <TableComponent>
      <THead>
        <tr>
          <th scope="col" class="px-6 py-3">Location ID</th>
          <th scope="col" class="px-6 py-3">Location Name</th>
          <th scope="col" class="px-6 py-3">Code</th>
          <th scope="col" class="px-6 py-3">Actions</th>
        </tr>
      </THead>
      <tbody>
        <tr
          class="bg-white border-b"
          v-for="location in locationsStore.locations"
          :key="location.id"
        >
          <td class="px-6 py-4 text-gray-700">
            {{ location.id }}
          </td>
          <td class="px-6 py-4 text-gray-700">
            <form
              v-if="currentLocation === location.id"
              novalidate
              @submit.prevent="handleSubmitEditForm"
            >
              <div class="mt-2 flex space-between">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autocomplete="name"
                  placeholder="Location name"
                  required=""
                  :disabled="editLocationForm.loading"
                  aria-required="true"
                  v-model="editLocationForm.values.name"
                  autofocus
                  class="block w-120 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                <button
                  type="submit"
                  class="ml-4 text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800 dark:hover:bg-blue-500"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="w-4 h-4"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z"
                      clip-rule="evenodd"
                    />
                  </svg>

                  <span class="sr-only">Save Icon</span>
                </button>
              </div>
              <span class="text-red-500" v-if="editLocationForm.errors.name">{{
                editLocationForm.errors.name
              }}</span>
            </form>
            <span v-else>
              {{ location.name }}
            </span>
          </td>
          <td class="px-6 py-4 text-gray-700">
            {{ location.locationCode }}
          </td>
          <td class="px-6 py-4 text-gray-700">
            <button
              v-if="location.id !== currentLocation"
              type="button"
              @click="handleSelect(location)"
              class="text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800 dark:hover:bg-blue-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-4 h-4"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                />
              </svg>

              <span class="sr-only">Edit Icon</span>
            </button>
            <button
              type="button"
              @click="handleDelete(location.id)"
              class="text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800 dark:hover:bg-blue-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-4 h-4"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>

              <span class="sr-only">Delete icon</span>
            </button>
          </td>
        </tr>
      </tbody>
    </TableComponent>
  </div>
</template>

<style scoped>
/* Your component styles here */
</style>
