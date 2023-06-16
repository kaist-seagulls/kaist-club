<template>
  <div class="t-box t-flex-g1">
    <div class="t-title">
      CalendarView (month={{ props.month }}, year={{ props.year }})
    </div>
    <div>
      <CalendarComp :month="month" :year="year" />
    </div>
  </div>
</template>

<script setup>
import { defineProps } from "vue"
import CalendarComp from "@/components/CalendarComp.vue"

const props = defineProps({
  month: String,
  year: String,
})

</script>
