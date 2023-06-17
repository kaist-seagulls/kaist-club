<template>
  <div class="t-box t-flex-g1">
    <div class="t-title">
      MainView (q={{ q }}, isEmpty={{ q === "" ? true : false }})
    </div>
    <div>
      ToFill: Posts
    </div>
  </div>
</template>

<script>
export default {
  name: "MainView",
  props: {
    q: String,
  },
}
</script>
