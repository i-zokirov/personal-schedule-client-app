<script setup></script>

<template>
  <header class="bg-white">
    <nav class="mx-auto flex items-center justify-between p-6 lg:px-8" aria-label="Global">
      <div class="flex lg:flex-1">
        <a href="#" class="-m-1.5 p-1.5">
          <span class="sr-only">Schedule App</span>
          <img
            class="h-8 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt=""
          />
        </a>
      </div>

      <div class="">
        <RouterLink to="/" class="text-sm font-semibold leading-6 text-gray-900"
          >Calendar</RouterLink
        >
        <span class="mx-2"></span>
        <RouterLink to="/locations" class="text-sm font-semibold leading-6 text-gray-900"
          >Locations</RouterLink
        >
      </div>

      <div class="lg:flex lg:flex-1 lg:justify-end">
        <a href="#" class="text-sm font-semibold leading-6 text-gray-900"
          >Log out <span aria-hidden="true">&rarr;</span></a
        >
      </div>
    </nav>
  </header>
</template>

<style scoped></style>
