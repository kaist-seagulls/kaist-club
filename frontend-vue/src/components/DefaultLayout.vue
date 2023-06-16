<template>
  <div class="t-title">
    DefaultLayout (NavBar and FilterBox)
  </div>
  <NavBar />
  <div class="t-flex">
    <FilterBox />
    <slot />
  </div>
</template>
<script>
import NavBar from "@/components/NavBar.vue"
import FilterBox from "@/components/FilterBox.vue"

export default {
  name: "AdminView",
  components: {
    NavBar,
    FilterBox,
  },
}
</script>
