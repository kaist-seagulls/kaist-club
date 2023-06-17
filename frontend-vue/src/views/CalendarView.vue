<template>
  <div class="t-box t-flex-g1">
    <div class="t-title">
      CalendarView (month={{ month }}, year={{ year }})
    </div>
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
