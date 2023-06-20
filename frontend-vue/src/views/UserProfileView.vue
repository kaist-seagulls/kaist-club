<template>
  <div class="flex-user-profile">
    <div class="user-profile-box">
      <div class="user-profile-email">
        Email: {{ userInfo.userId }}
      </div>
      <div>
        Phone Number: {{ userInfo.phoneNumber || "Not Found" }}
      </div>
      <div class="user-profile-buttons">
        <button class="big-blue-button user-profile-button-margin" v-if="isRepresentative">
          Manage My Club
        </button>
        <button class="big-blue-button" @click="goChangePassword()">
          Change Password
        </button>
      </div>
    </div>
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
