<template>
  <table
    class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
    v-bind:class="tableClass"
  >
    <slot></slot>
  </table>
</template>

<script setup>
defineProps({
  tableClass: String,
})
</script>

<style scoped>
/* Component styles go here */
</style>
