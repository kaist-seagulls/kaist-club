<template>
  <component :is="layout">
    <router-view />
  </component>
</template>

<script setup>
import { computed } from '@vue/reactivity';
import { useRoute } from 'vue-router';
import DefaultLayout from '@/components/DefaultLayout.vue'

const layout = computed(() => useRoute().meta.layout || DefaultLayout)
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
.t-box {
  border: 1px solid black;
  padding: 5px;
  margin: 5px;
}
.t-title {
  color: grey
}
</style>
