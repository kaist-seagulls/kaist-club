<template>
  <div>
    calendar component
  </div>
  <div>
    <div v-for="weekday in week" v-bind:key="weekday">{{ weekday }}</div>
    <div v-for="day in calendar" v-bind:key="day">{{ day.number }}</div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex"

export default {
  name: "FilterBox",
  data() {
    return {
      week: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    }
  },
  computed: {
    ...mapGetters({
      events: "events",
      calendar: "calendar",
    }),
  },
  methods: {
    ...mapActions({
      fetchCalendar: "fetchCalendar",
      applyEvents: "applyEvents",
    }),
  },
  props: {
    month: String,
    year: String,
  },
  beforeMount() {
    this.fetchCalendar({month: this.month, year: this.year})
  },
  onUpdated() {
    console.log("UPDATED calendar component")
  },
}
</script>
