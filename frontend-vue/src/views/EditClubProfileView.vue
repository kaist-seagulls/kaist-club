<template>
  <div class="t-box t-flex-g1">
    <div class="t-title">
      EdivClubProfileView
    </div>
    <img src="example-api-address">
    <input type="file" @change="handleFileUpload($event)" />
    <div>
      Club Name: {{ clubProfile.name }}
    </div>
    <div>
      Category:
      <span>
        <input type="text" v-model="category">
      </span>
    </div>
    <div>
      Description:
      <span>
        <input type="text" v-model="description">
      </span>
    </div>
    <div>
      <button @click="editClubProfile()">Submit Changes</button>
    </div>
  </div>
</template>

<script>
import axios from "axios"
import { mapGetters, mapActions } from "vuex"

export default {
  name: "ClubProfileView",
  data() {
    return {
      file: "",
      category: "",
      description: "",
    }
  },
  computed: {
    ...mapGetters({
      userInfo: "userInfo",
      clubProfile: "clubProfile",
    }),
  },
  methods: {
    handleFileUpload(event) {
      this.file = event.target.files[0]
    },
    editClubProfile() {
      let profile = {
        categoryId: this.category,
        name: this.clubProfile.name,
        description: this.description,
      }
      axios
        .post("/api/v1/update-club-profile" + this.clubProfile.name, profile)
        .then(() => {
          this.$router.push("/club/" + this.clubProfile.name)
        })
        .catch((err) => {
          alert(err)
          console.log(err)
        })
    },
    ...mapActions({
      fetchClubProfile: "fetchClubProfile",
    }),
  },
  beforeMount() {
    try{
      this.fetchClubProfile(this.userInfo.representing)
    } finally {
      this.category = this.clubProfile.category
      this.description = this.clubProfile.description
    }
  },
}
</script>
