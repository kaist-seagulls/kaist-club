<template>
  <div class="t-box t-flex-g1">
    <div class="t-title">
      ClubProfileView (id={{ props.id }})
    </div>
    <img src="example-api-address">
    <div>
      Club Name: {{ clubProfile.name }}
    </div>
    <div>
      Category: {{ clubProfile.category-id }}
    </div>
    <div>
      Description: {{ clubProfile.description }}
    </div>
  </div>
</template>

<script>
import axios from "axios"
import { mapGetters, mapActions } from "vuex"

export default {
  name: "ClubProfileView",
  props: {
    id: String,
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
    ...mapActions({
      fetchClubProfile: "fetchClubProfile",
    }),
  },
  beforeMount() {
    this.fetchClubProfile(this.id)
  },
}
</script>
