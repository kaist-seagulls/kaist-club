<template>
  <div class="filter-option-box" style="justify-content: space-between">
    <button class="filter-profile">{{ filter.name }}</button>
    <button class="check-box-pic" @click="toggle()">
      <div style="height: 15px;" v-if="filter.isChecked">
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M13.3333 13.3333H1.66667V1.66667H10V0H1.66667C0.741667 0 0 0.741667 0 1.66667V13.3333C0 13.7754 0.175595 14.1993 0.488155 14.5118C0.800716 14.8244 1.22464 15 1.66667 15H13.3333C13.7754 15 14.1993 14.8244 14.5118 14.5118C14.8244 14.1993 15 13.7754 15 13.3333V6.66667H13.3333M4.09167 5.9L2.91667 7.08333L6.66667 10.8333L15 2.5L13.825 1.31667L6.66667 8.475L4.09167 5.9Z"
            fill="#808080" />
        </svg>
      </div>
      <div style="height: 15px;" v-else>
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M13.3333 0H1.66667C0.741667 0 0 0.741667 0 1.66667V13.3333C0 13.7754 0.175595 14.1993 0.488155 14.5118C0.800716 14.8244 1.22464 15 1.66667 15H13.3333C13.7754 15 14.1993 14.8244 14.5118 14.5118C14.8244 14.1993 15 13.7754 15 13.3333V1.66667C15 0.741667 14.25 0 13.3333 0ZM13.3333 1.66667V13.3333H1.66667V1.66667H13.3333Z"
            fill="#808080" />
        </svg>
      </div>
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
