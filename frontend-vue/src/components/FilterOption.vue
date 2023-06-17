<template>
  <div class="t-box t-flex" style="justify-content: space-between">
    <button>Profile</button>
    <div>
      {{ filter.name }}
    </div>
    <button @click="toggle()">
      <div v-if="filter.isChecked" style="color: green">V</div>
      <div v-else style="color: red">X</div>
    </button>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex"

export default {
  props: {
    filter: Object,
  },
  computed: {
    ...mapGetters({
      searchPage: "searchPage",
      searchQ: "searchQ",
    }),
  },
  methods: {
    ...mapActions({
      toggleChecked: "toggleChecked",
      fetchData: "fetchData",
    }),
    toggle() {
      this.toggleChecked(this.filter.name)
      if (this.$route.name === "main") {
        if (this.searchPage !== 1) {
          this.$router.push({
            name: "main",
            query: {
              q: this.searchQ,
              page: 1,
            },
          })
        } else {
          this.fetchData({ to: this.$route })
        }
      }
    },
  },
}
</script>
