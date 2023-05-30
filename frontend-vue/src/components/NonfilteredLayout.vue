<template>
  <div class="t-title">
    NonfilteredLayout (Only NavBar)
  </div>
  <NavBar />
  <slot />
</template>
<script setup>
import NavBar from '@/components/NavBar.vue'

</script>
