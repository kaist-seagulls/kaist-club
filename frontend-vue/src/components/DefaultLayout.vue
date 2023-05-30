<template>
  <div class="t-title">
    DefaultLayout (NavBar and FilterBox)
  </div>
  <NavBar />
  <FilterBox />
  <slot />
</template>
<script setup>
import NavBar from '@/components/NavBar.vue'
import FilterBox from '@/components/FilterBox.vue';

</script>
