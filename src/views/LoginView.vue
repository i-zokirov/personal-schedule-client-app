<template>
  <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <img
        class="mx-auto h-10 w-auto"
        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
        alt="Your Company"
      />
      <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
        Sign in to your account
      </h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form class="space-y-6" action="#" @submit.prevent="handleSubmit" novalidate>
        <div>
          <label for="email" class="block text-sm font-medium leading-6 text-gray-900"
            >Email address</label
          >
          <div class="mt-2">
            <input
              id="email"
              name="email"
              type="email"
              autocomplete="email"
              required=""
              v-model="form.email"
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
          <span class="text-red-500" v-if="errors.email">{{ errors.email }}</span>
        </div>

        <div>
          <div class="flex items-center justify-between">
            <label for="password" class="block text-sm font-medium leading-6 text-gray-900"
              >Password</label
            >
            <div class="text-sm">
              <a href="#" class="font-semibold text-indigo-600 hover:text-indigo-500"
                >Forgot password?</a
              >
            </div>
          </div>
          <div class="mt-2">
            <input
              id="password"
              name="password"
              type="password"
              autocomplete="current-password"
              required=""
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              v-model="form.password"
            />
          </div>
          <span class="text-red-500" v-if="errors.password">{{ errors.password }}</span>
        </div>

        <div>
          <button
            type="submit"
            class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Sign in
          </button>
        </div>
      </form>

      <p class="mt-10 text-center text-sm text-gray-500">
        Not a member?
        {{ ' ' }}
        <RouterLink
          to="/signup"
          class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >Sign Up here</RouterLink
        >
      </p>
    </div>
  </div>
</template>

<script>
import * as Yup from 'yup'
import apiUrl from '@/api/index'

const validationSchema = Yup.object({
  email: Yup.string().email().required(),
  password: Yup.string().required(),
})

export default {
  name: 'LoginView',
  data(){
    return {
      form: {
        email: '',
        password: '',
      },
      errors: {
        email: '',
        password: '',
      },
    }
  
  },
  watch: {
    'form.email': function (newVal) {
      this.validate('email');
    },
    'form.password': function (newVal) {
      this.validate('password');
    }
  },
  methods: {
    async handleSubmit() {
      // Handle form submission
      validationSchema.validate(this.form, { abortEarly: false })
        .then(async() => {
          // Validation passed
          try {
            const response = await apiUrl.post('/auth/login', this.form)
            console.log(response)
          } catch (err) {
            console.log(err)
          }
        })
        .catch((err) => {
          err.inner.forEach((error) => {
            this.errors = { ...this.errors, [error.path]: error.message }
          })
        })
    },
    validate(field) {
        validationSchema.validateAt(field, this.form)
        .then(() => (this.errors[field] = ''))
        .catch((err) => {
          this.errors[err.path] = err.message
        })
    },
  }
}
</script>

<style scoped>
/* Your component styles go here */
</style>
