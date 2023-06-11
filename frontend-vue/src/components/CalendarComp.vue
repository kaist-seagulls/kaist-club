<template>
  <div>
    calendar component
  </div>
  <div>
    <div style="display: flex">
      <button @click=goPrev()>PREV</button>
      <div>{{ year }} - {{ month }}</div>
      <button @click=goNext()>NEXT</button>
    </div>
    <div v-if="calendarRepresentation">
      <div v-for="week in calendarRepresentation.weeks" :key="week">
        <h1>WEEK {{ week.weekNumber }}</h1>
        <div v-for="day in week.days" :key="day">
          <h3>
            {{ day.year }}-{{ day.month }}-{{ day.date }}-{{ dayString[day.day] }}
          </h3>
          <div v-for="(e, eventIdx) in day.events" :key="eventIdx">
            {{ e ? ("EVENT " + String(eventIdx) + ": " + e.title) : "" }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex"

export default {
  name: "FilterBox",
  data() {
    return {
      dayString: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    }
  },
  computed: {
    ...mapGetters({
      calendarRepresentation: "calendarRepresentation",
    }),
  },
  methods: {
    ...mapActions({
      fetchCalendar: "fetchCalendar",
    }),
    goPrev() {
      const m = Number(this.month)
      const y = Number(this.year)
      this.$router.push({
        name: "calendar",
        params: {
          month: (m === 1) ? 12 : (m - 1),
          year: (m === 1) ? (y - 1) : y,
        },
      })
    },
    goNext() {
      const m = Number(this.month)
      const y = Number(this.year)
      this.$router.push({
        name: "calendar",
        params: {
          month: (m === 12) ? 1 : (m + 1),
          year: (m === 12) ? (y + 1) : y,
        },
      })
    },
  },
  props: {
    month: String,
    year: String,
  },
  onUpdated() {
    console.log("UPDATED calendar component")
  },
}
</script>
