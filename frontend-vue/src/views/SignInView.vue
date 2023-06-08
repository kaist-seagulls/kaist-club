<template>
  <div class="logo-fixed">
    <img :src="require('@/assets/KAIST-Logo.wine.svg')" width="100">
  </div>
  <div class="flex-log"> 
    <div class="heading-log">
      Sign In
    </div>
    <div class="input-group">
      <div class="input-heading"> 
        Email
      </div>
      <div class="many-elements-input">
        <input class="text-box-default" type="id" v-model="id" />
        <div class="kaist-mail">
          @kaist.ac.kr
        </div>
      </div>
      <div class="no-red-msg">
        Invalid Id
      </div>
    </div>
    <div class="input-group">
      <div class="input-heading">
        Password
      </div>
      <div>
        <input class="text-box-default" type="password" v-model="pw" />
      </div>
      <div class="no-red-msg">
        Wrong password
      </div>
    </div>
    <div class="link" id="forgot-pW">
      <a @click="goForgotPassword()">Forgot password?</a>
    </div>
    <div>
      <button class="big-blue-button" @click="login()">Sign In</button>
    </div>
    <div class="link">
      <a @click="goSignup()">Sign up</a>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import axios from "axios"
import { useRouter } from "vue-router"

const router = useRouter()
const prefix = "api/v1/"

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
    .post(prefix + "sign-in", {
      userId: id.value,
      password: pw.value,
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
