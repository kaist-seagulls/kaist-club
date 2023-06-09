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

<script setup>
import axios from "axios"
import { ref } from "vue"
import { useRouter, useRoute } from "vue-router"

const router = useRouter()
const route = useRoute()

const q = ref(route.query.q || "")

function goSearch() {
  if (q.value === "") {
    router.push("/")
  } else {
    router.push({
      name: "main",
      query: {
        q: q.value,
      },
    })
  }
}
function goMain() {
  router.push("/")
}
function goCreatePost() {
  router.push("/newpost")
}
function goCreateClub() {
  router.push("/newclub")
}
function goCalendar() {
  const today = new Date()
  const month = today.getMonth().toString()
  const year = today.getFullYear().toString()
  router.push({
    name: "calendar",
    params: { month, year },
  })
}
function goUserProfile() {
  router.push("/mypage")
}
async function signOut() {
  try {
    await axios.post("/api/v1/sign-out")
    router.push("/signin")
  } catch (e) {
    alert(e)
  }
}
</script>
