<template>
  <div class="logo-fixed">
    <img :src="require('@/assets/KAIST-Logo.wine.svg')" width="100">
  </div>
  <div class="flex-nav-bar">
    <div class="nav-main">
      <button class="nav-button" id="nav-button-selected" @click="goMain()">
        <img class="nav-icon" :src="require('@/assets/MainIconSelected.png')" width="25">
        Main
      </button>
    </div>
    <div>
      <button class="nav-button" @click="goCreatePost()">
        <img class="nav-icon" :src="require('@/assets/NewPostIcon.png')" width="24">
        New Post
      </button>
    </div>
    <div>
      <button class="nav-button" @click="goCreateClub()">
        <img class="nav-icon" :src="require('@/assets/CreateNewClubIcon.png')" width="25">
        Create New Club
      </button>
    </div>
    <div>
      <button class="nav-button" @click="goCalendar()">
        <img class="nav-icon" :src="require('@/assets/CalendarIcon.png')" width="23">
        Calendar
      </button>
    </div>
    <div>
      <button class="nav-button" @click="goUserProfile()">
        <img class="nav-icon" :src="require('@/assets/UserProfileIcon.png')" width="24">
        User Profile
      </button>
    </div>
    <div>
      <button class="nav-button" @click="signOut()">
        Log out
      </button>
    </div>
  </div>
</template>

<script >
import api from "@/api"
import { mapGetters } from "vuex"

export default {
  name: "NavBar",
  components: {},
  computed: {
    ...mapGetters({
      searchQ: "searchQ",
      searchPage: "searchPage",
    }),
  },
  methods: {
    goMain() {
      const query = {}
      if (this.searchQ !== "") {
        query.q = this.searchQ
      }
      if (this.searchPage !== 1) {
        query.page = this.searchPage
      }
      this.$router.push({
        name: "main",
        query,
      })
    },
    goCreatePost() {
      this.$router.push("/newpost")
    },
    goCreateClub() {
      this.$router.push("/newclub")
    },
    goCalendar() {
      const today = new Date()
      const month = (today.getMonth() + 1).toString()
      const year = today.getFullYear().toString()
      this.$router.push({
        name: "calendar",
        params: { month, year },
      })
    },
    goUserProfile() {
      this.$router.push("/mypage")
    },
    async signOut() {
      try {
        await api.signOut()
        this.$router.push("/signin")
      } catch (e) {
        alert(e)
      }
    },
  },
}

</script>
