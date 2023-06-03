<template>
  <div class="t-title">
    NoLayout (Only View)
  </div>
  <div>
    <button @click="goMain()">Main</button>
  </div>
  <slot />
</template>
<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
function goMain() {
  router.push('/')
}
</script>
