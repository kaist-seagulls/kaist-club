<template>
  <div class="flex-nav-bar">
    <div class="logo-fixed">
      <img :src="require('@/assets/KAIST-Logo.wine.svg')" width="100">
    </div>
    <div class="nav-main">
      <button class="nav-button" :id="selectedMain" @click="goMain()">
        <svg class="nav-icon" width="25" viewBox="0 0 40 35" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 35V22.6471H24V35H34V18.5294H40L20 0L0 18.5294H6V35H16Z"
            :fill="isMainSelected ? '#18408C' : '#698FC1'" />
        </svg>
        Main
      </button>
    </div>
    <div>
      <button v-if="userInfo.representingClub" class="nav-button" :id="selectedNewPost" @click="goCreatePost()">
        <svg class="nav-icon" width="24" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M28.5421 7.63158C29.1526 7.02105 29.1526 6.10526 28.5421 5.49474L25.0316 1.98421C24.4211 1.37368 23.5053 1.37368 22.8947 1.98421L20.1474 4.73158L25.9474 10.5316M1.52632 23.2V29H7.32631L24.1158 12.0579L18.4684 6.25789L1.52632 23.2ZM7.63158 0V4.57895H12.2105V7.63158H7.63158V12.2105H4.57895V7.63158H0V4.57895H4.57895V0H7.63158Z"
            :fill="isNewPostSelected ? '#18408C' : '#698FC1'" />
        </svg>
        New Post
      </button>
    </div>
    <div>
      <button class="nav-button" :id="selectedCalendar" @click="goCalendar()">
        <svg class="nav-icon" width="23" viewBox="0 0 29 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M9.66667 14.4V17.6H6.44444V14.4H9.66667ZM16.1111 14.4V17.6H12.8889V14.4H16.1111ZM22.5556 14.4V17.6H19.3333V14.4H22.5556ZM25.7778 3.2C26.6324 3.2 27.4519 3.53714 28.0562 4.13726C28.6605 4.73737 29 5.55131 29 6.4V28.8C29 29.6487 28.6605 30.4626 28.0562 31.0627C27.4519 31.6629 26.6324 32 25.7778 32H3.22222C1.43389 32 0 30.56 0 28.8V6.4C0 5.55131 0.339483 4.73737 0.943767 4.13726C1.54805 3.53714 2.36764 3.2 3.22222 3.2H4.83333V0H8.05556V3.2H20.9444V0H24.1667V3.2H25.7778ZM25.7778 28.8V11.2H3.22222V28.8H25.7778ZM9.66667 20.8V24H6.44444V20.8H9.66667ZM16.1111 20.8V24H12.8889V20.8H16.1111ZM22.5556 20.8V24H19.3333V20.8H22.5556Z"
            :fill="isCalendarSelected ? '#18408C' : '#698FC1'" />
        </svg>
        Calendar
      </button>
    </div>
    <div>
      <button class="nav-button" :id="selectedMyPage" @click="goUserProfile()">
        <svg class="nav-icon" width="24" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M14.5 24.94C10.875 24.94 7.6705 23.084 5.8 20.3C5.8435 17.4 11.6 15.805 14.5 15.805C17.4 15.805 23.1565 17.4 23.2 20.3C21.3295 23.084 18.125 24.94 14.5 24.94ZM14.5 4.35C15.6537 4.35 16.7601 4.8083 17.5759 5.62409C18.3917 6.43987 18.85 7.54631 18.85 8.7C18.85 9.85369 18.3917 10.9601 17.5759 11.7759C16.7601 12.5917 15.6537 13.05 14.5 13.05C13.3463 13.05 12.2399 12.5917 11.4241 11.7759C10.6083 10.9601 10.15 9.85369 10.15 8.7C10.15 7.54631 10.6083 6.43987 11.4241 5.62409C12.2399 4.8083 13.3463 4.35 14.5 4.35ZM14.5 0C12.5958 0 10.7103 0.375054 8.95109 1.10375C7.19187 1.83244 5.5934 2.9005 4.24695 4.24695C1.52767 6.96623 0 10.6544 0 14.5C0 18.3456 1.52767 22.0338 4.24695 24.753C5.5934 26.0995 7.19187 27.1676 8.95109 27.8963C10.7103 28.6249 12.5958 29 14.5 29C18.3456 29 22.0338 27.4723 24.753 24.753C27.4723 22.0338 29 18.3456 29 14.5C29 6.4815 22.475 0 14.5 0Z"
            :fill="isMyPageSelected ? '#18408C' : '#698FC1'" />
        </svg>
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
import { mapActions, mapGetters } from "vuex"

const selectedId = "nav-button-selected"

export default {
  name: "NavBar",
  components: {},
  computed: {
    ...mapGetters({
      searchQ: "searchQ",
      searchPage: "searchPage",
      userInfo: "userInfo",
    }),
    isMainSelected() {
      return this.$route.name === "main"
    },
    isNewPostSelected() {
      return this.$route.name === "newpost"
    },
    isCalendarSelected() {
      return this.$route.name === "calendar"
    },
    isMyPageSelected() {
      return this.$route.name === "mypage"
    },
    selectedMain() {
      return this.isMainSelected ? selectedId : null
    },
    selectedNewPost() {
      return this.isNewPostSelected ? selectedId : null
    },
    selectedCalendar() {
      return this.isCalendarSelected ? selectedId : null
    },
    selectedMyPage() {
      return this.isMyPageSelected ? selectedId : null
    },
    isRepresentative() {
      return this.userInfo.userId === "representative"
    },
    ...mapGetters({
      userInfo: "userInfo",
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
    ...mapActions({
      fetchUserInfo: "fetchUserInfo",
    }),
    beforeMount() {
      this.fetchUserInfo()
    },
  },
}

</script>
