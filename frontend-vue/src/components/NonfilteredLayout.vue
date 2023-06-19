<template>
  <NavBar />
  <slot />
</template>
<script>
import NavBar from "@/components/NavBar.vue"
export default {
  name: "NonfilteredLayout",
  components: {
    NavBar,
  },
}
</script>
