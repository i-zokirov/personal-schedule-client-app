<template>
  <thead
    class="text-xs text-gray-700 uppercase bg-gray-50 dark:text-gray-600"
    v-bind:class="tHeadClass"
  >
    <slot></slot>
  </thead>
</template>

<script setup>
defineProps({
  tHeadClass: String,
})
</script>

<style scoped></style>
