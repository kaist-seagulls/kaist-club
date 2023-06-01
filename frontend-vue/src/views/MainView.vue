<template>
  <div class="t-box t-flex-g1">
    <div class="t-title">
      MainView (q={{ props.q }}, isEmpty={{ props.q === "" ? true : false }})
    </div>
    <div>
      ToFill: Posts
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  q: String
})
</script>
