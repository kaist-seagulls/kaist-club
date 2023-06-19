<template>
  <div class="flex-user-profile">
    <div class="user-profile-box">
      <div>
        Username: {{ userInfo.userId }}
      </div>
      <div>
        Phone Number: {{ userInfo.phoneNumber || "Not Found" }}
      </div>
      <span>
        <button class="big-blue-button" v-if="isRepresentative">
          Manage My Club
        </button>
      </span>
      <span>
        <button class="big-blue-button" @click="goChangePassword()">
          Change Password
        </button>
      </span>
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
