<template>
  <div class="calendar-view">
    <div class="calendar-heading">
      <button @click=goPrev()>◀</button>
      <div class="calendar-heading-text">{{ monthString[month - 1] }} {{ year }} </div>
      <button @click=goNext()>▶</button>
    </div>
    <div class="calendar">
      <div class="day-of-week">Sun</div>
      <div class="day-of-week">Mon</div>
      <div class="day-of-week">Tue</div>
      <div class="day-of-week">Wed</div>
      <div class="day-of-week">Thu</div>
      <div class="day-of-week">Fri</div>
      <div class="day-of-week">Sat</div>
      <template v-if="calendarRepresentation">
        <template v-for="week in calendarRepresentation.weeks" :key="week">
          <div v-for="day in week.days" :key="day">
            <div class="calendar-flex" id="dimmed-date" v-if="day.month !== Number(month)">
              {{ day.date }}
            </div>
            <div class="calendar-flex" v-else>
              {{ day.date }}
            </div>
            <div v-for="(e, eventIdx) in day.events" :key="eventIdx">
              {{ e ? ("EVENT " + String(eventIdx) + ": " + e.title) : "" }}
            </div>
          </div>
        </template>
      </template>
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
      monthString: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
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
}
</script>
