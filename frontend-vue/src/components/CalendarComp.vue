<template>
  <div class="calendar-view">
    <div class="calendar-heading">
      <button class="arrow-button" @click=goPrev()>◀</button>
      <div class="calendar-heading-text">{{ monthString[month - 1] }} {{ year }} </div>
      <button class="arrow-button" @click=goNext()>▶</button>
    </div>
    <div class="calendar-5-week" v-if="calendarRepresentation.weeks.length == 5">
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
            <div id="dimmed-date" v-if="day.month !== Number(month)">
            </div>
            <div class="calendar-flex" v-else>
              {{ day.date }}
            </div>
            <div v-for="(e, eventIdx) in day.events" :key="eventIdx">
              <div id="dimmed-date" v-if="day.month !== Number(month)">
              </div>
              <div v-else>
                <div class="event" v-if="(e, eventIdx) in day.events == true">
                  {{ e ? (e.title) : "" }}
                </div>
                <div class="event" id="dimmed-date" v-else>
                </div>
              </div>
            </div>
          </div>
        </template>
      </template>
    </div>
    <div class="calendar-6-week" v-else>
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
            <div class="dimmed-date" v-if="day.month !== Number(month)">
            </div>
            <div class="calendar-flex" v-else>
              {{ day.date }}
            </div>
            <div v-for="(e, eventIdx) in day.events" :key="eventIdx">
              <div class="dimmed-date" v-if="day.month !== Number(month)">
              </div>
              <div class="calendar-flex" v-else>
                <span class="circle"></span>
                {{ e ? (e.title) : "" }}
              </div>
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
