<template>
  <div class="t-box t-flex-g1">
    <div class="t-title">
      ClubProfileView (id={{ clubName }})
    </div>
    <!-- <img src="example-api-address"> -->
    <div>
      Club Name: {{ clubProfile.clubName }}
    </div>
    <div>
      Category: {{ clubProfile.categoryName }}
    </div>
    <div>
      Description: {{ clubProfile.descriptions }}
    </div>
  </div>
</template>

<script>
import axios from "axios"
import { mapGetters } from "vuex"

export default {
  name: "ClubProfileView",
  props: {
    clubName: String,
  },
  computed: {
    ...mapGetters({
      clubProfile: "clubProfile",
    }),
  },
  methods: {
    fetchLogoImg() {
      axios
        .get("api/v1/get-image-example")
        .then()
    },
  },
}
</script>
