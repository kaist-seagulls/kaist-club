<template>
  <div class="t-box">
    <div class="t-title">
      FilterBox
    </div>
    <div class="t-box t-flex-g0">
      <div class="t-title">
        FilterSearchBox
      </div>
    </div>
    <div class="t-box">
      <div class="t-title">
        FilterOptions
      </div>
      <div>
        <div>
          Joined
          <button @click="toggleJoinedChecked()">
            <div v-if="isAllJoinedChecked" style="color: green;">V</div>
            <div v-else style="color:   red;">X</div>
          </button>
        </div>
        <div>
          <FilterOption v-for="filter in filterConfig.joined" :filter="filter" :key="filter.name" />
        </div>
        <div>
          Subscribed
          <button @click="toggleNotJoinedChecked()">
            <div v-if="isAllNotJoinedChecked" style="color: green;">V</div>
            <div v-else style="color:   red;">X</div>
          </button>
        </div>
        <div>
          <FilterOption v-for="filter in filterConfig.notJoined" :filter="filter" :key="filter.name" />
        </div>
        <div>
          All
          <button @click="toggleNoFilter()">
            <div v-if="isNoFilterChecked" style="color: green;">V</div>
            <div v-else style="color: red;">X</div>
          </button>
        </div>
      </div>
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
      filterConfig: "filterConfig",
      isAllJoinedChecked: "isAllJoinedChecked",
      isAllNotJoinedChecked: "isAllNotJoinedChecked",
      isNoFilterChecked: "isNoFilterChecked",
    }),
  },
  methods: {
    ...mapActions({
      fetchRelatedClubs: "fetchRelatedClubs",
      toggleJoinedChecked: "toggleJoinedChecked",
      toggleNotJoinedChecked: "toggleNotJoinedChecked",
      toggleNoFilter: "toggleNoFilter",
    }),
  },
}
</script>
