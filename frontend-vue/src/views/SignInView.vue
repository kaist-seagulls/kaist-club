<template>
  <div class="t-box">
    <div class="t-title">
      SignInView
    </div>
    <div>
      Login
      <label>
        <span>Id</span>
        <input type="id" v-model="id" />
      </label>
      <label>
        <span>Password</span>
        <input type="password" v-model="pw" />
      </label>
      <button @click="login()">Login</button>
    </div>
    <div>
      <button @click="goForgotPassword()">Forgot password?</button>
      <button @click="goSignup()">Sign up</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import axios from "axios"
import { useRouter } from "vue-router"

const router = useRouter()

const id = ref("")
const pw = ref("")

function goForgotPassword() {
  router.push("/forgotpassword")
}
function goHome() {
  router.push("/")
}
function goSignup() {
  router.push("/signup")
}
function login() {
  axios
    .post("/sign-in", {
      userId: id,
      password: pw,
    })
    .then(() => {
      goHome()
    })
    .catch(err => {
      alert(err)
      console.log(err)
    })
  // goHome()
}
</script>
