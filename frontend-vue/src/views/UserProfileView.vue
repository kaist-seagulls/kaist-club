<template>
  <div class="t-box">
    <div class="t-title">
      UserProfileView
    </div>
    <div>
      Username: {{ userInfo.userId }}
    </div>
    <div>
      Phone Number: {{ userInfo.phoneNumber || "Not Found" }} 
    </div>
    <span>
      <button v-if="isRepresentative">
        Manage My Club
      </button>
    </span>
    <span>
      <button @click="goChangePassword()">
        Change Password
      </button>
    </span>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex"

export default {
  name: "UserProfileView",
  computed: {
    isRepresentative() {
      return this.userInfo.userId === "representative"
    },
    ...mapGetters({
      userInfo: "userInfo",
    }),
  },
  methods: {
    goChangePassword() {
      this.$router.push("/changepassword")
    },
    ...mapActions({
      fetchUserInfo: "fetchUserInfo",
    }),
  },
  beforeMount() {
    this.fetchUserInfo()
  },
}
</script>
