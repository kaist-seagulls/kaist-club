<template>
  <component :is="layout">
    <RouterView />
  </component>
</template>

<script setup>
import { computed } from '@vue/reactivity'
import { useRoute } from 'vue-router'

const layout = computed(() => useRoute().meta.layout)
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
  color: dodgerblue;
}
.t-flex-g0 {
  flex-grow: 0;
}
.t-flex-g1 {
  flex-grow: 1;
}
.t-flex {
  display: flex;
}
</style>
