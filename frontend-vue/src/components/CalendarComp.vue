<template>
  <div>
    calendar component
  </div>
</template>
<script setup>
import { onUpdated } from 'vue';
onUpdated(() => {
  console.log("UPDATED calendar component")
})
</script>
