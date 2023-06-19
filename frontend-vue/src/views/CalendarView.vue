<template>
  <div class="flex-calendar">
    <div>
      <CalendarComp :month="month" :year="year" />
    </div>
  </div>
</template>

<script>
import CalendarComp from "@/components/CalendarComp.vue"

export default {
  name: "CalendarView",
  components: {
    CalendarComp,
  },
  props: {
    month: String,
    year: String,
  },
}

</script>
