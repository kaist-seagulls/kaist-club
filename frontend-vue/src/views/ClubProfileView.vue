<template>
  <div class="t-box t-flex-g1">
    <div class="t-title">
      ClubProfileView (id={{ props.id }})
    </div>
    <div>
      ToFill: ClubProfileView Inners
    </div>
  </div>
</template>

<script setup>
import { defineProps } from "vue"

const props = defineProps({
  id: String,
})

</script>