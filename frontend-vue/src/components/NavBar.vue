<template>
  <div class="t-box">
    <div class="t-title">
      NavBar
    </div>
    <div>
      <input v-model="q" />
      <button @click="goSearch()">Search</button>
    </div>
    <div>
      <button @click="goMain()">Main</button>
    </div>
    <div>
      <button @click="goCreatePost()">New Post</button>
    </div>
    <div>
      <button @click="goCreateClub()">Create New Club</button>
    </div>
    <div>
      <button @click="goCalendar()">Calendar</button>
    </div>
    <div>
      <button @click="goUserProfile()">User Profile</button>
    </div>
    <div>
      <button @click="signOut()">CALL POST /api/v1/sign-out</button>
    </div>
    <div>
      ToFill: NavBar Inners
    </div>
  </div>
</template>

<script >
import axios from "axios"

export default {
  name: "NavBar",
  components: {},
  data() {
    return {
      q: "",
    }
  },
  methods: {
    goSearch() {
      if (this.q === "") {
        this.$router.push("/")
      } else {
        this.$router.push({
          name: "main",
          query: {
            q: this.q,
          },
        })
      }
    },
    goMain() {
      this.$router.push("/")
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
        await axios.post("/api/v1/sign-out")
        this.$router.push("/signin")
      } catch (e) {
        alert(e)
      }
    },
  },
}

</script>
