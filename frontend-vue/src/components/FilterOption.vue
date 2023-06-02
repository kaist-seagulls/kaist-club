<template>
  <div class="t-box t-flex" style="justify-content: space-between">
    <button>Profile</button>
    <div>
      {{ filter.name }}
    </div>
    <button @click="toggleChecked(filter.id)">
      <div v-if="filter.isChecked" style="color: green">V</div>
      <div v-else style="color: red">X</div>
    </button>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  props: {
    filter: Object,
  },
  methods: {
    ...mapActions({
      toggleChecked: "toggleChecked",
    }),
  },
};
</script>
