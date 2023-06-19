<template>
  <div class="flex-filter-box">
    <div class="filter">
      <div class="search-bar">
        <input class="search-text-box" v-model="inputQ" />
        <button class="search-button" @click="goSearch()">Search</button>
      </div>
      <div class="filter-box">
        <div>
          <div class="filter-heading">
            Joined Clubs
            <button class="profile-button" @click="toggle(toggleJoinedChecked)">
              <div v-if="isAllJoinedChecked" style="color: green;">V</div>
              <div v-else style="color:   red;">X</div>
            </button>
          </div>
          <div>
            <FilterOption v-for="filter in filterConfig.joined" :filter="filter" :key="filter.name" />
          </div>
        </div>
        <div>
          <div class="filter-heading">
            Subscribed Clubs
            <button @click="toggle(toggleNotJoinedChecked)">
              <div v-if="isAllNotJoinedChecked" style="color: green;">V</div>
              <div v-else style="color:   red;">X</div>
            </button>
          </div>
        </div>
        <div>
          <FilterOption v-for="filter in filterConfig.notJoined" :filter="filter" :key="filter.name" />
        </div>
      </div>
    </div>
    <div class="filter-heading" id="all-kaist-clubs">
      All KAIST Clubs
      <button @click="toggle(toggleNoFilter)">
        <div v-if="isNoFilterChecked" style="color: green;">V</div>
        <div v-else style="color: red;">X</div>
      </button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
import FilterOption from "./FilterOption.vue"

export default {
  name: "FilterBox",
  components: {
    FilterOption,
  },
  computed: {
    ...mapGetters({
      searchQ: "searchQ",
      getInputQ: "inputQ",
      searchPage: "searchPage",
      filterConfig: "filterConfig",
      isAllJoinedChecked: "isAllJoinedChecked",
      isAllNotJoinedChecked: "isAllNotJoinedChecked",
      isNoFilterChecked: "isNoFilterChecked",
    }),
    inputQ: {
      get() {
        return this.getInputQ
      },
      set(q) {
        this.updateInputQ(q)
      },
    },
  },
  methods: {
    ...mapActions({
      updateInputQ: "updateInputQ",
      updateSearchQ: "updateSearchQ",
      updateSearchPage: "updateSearchPage",
      toggleJoinedChecked: "toggleJoinedChecked",
      toggleNotJoinedChecked: "toggleNotJoinedChecked",
      toggleNoFilter: "toggleNoFilter",
      fetchData: "fetchData",
    }),
    goSearch() {
      this.updateSearchQ(this.inputQ)
      this.updateSearchPage(1)
      if (this.inputQ === "") {
        this.$router.push("/")
      } else {
        this.$router.push({
          name: "main",
          query: {
            q: this.inputQ,
          },
        })
      }
    },
    removeQ() {
      this.updateInputQ("")
      this.updateSearchQ("")
      this.updateSearchPage(1)
      this.$router.push("/")
    },
    toggle(action) {
      action()
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
