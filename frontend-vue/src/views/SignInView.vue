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
        <input class="text-box-default" type="id" v-model="id" @keyup.enter="login()" />
        <div class="kaist-mail">
          @kaist.ac.kr
        </div>
      </div>
      <div class="dimmed-msg">
        Invalid Email
      </div>
    </div>
    <div class="input-group">
      <div class="input-heading">
        Password
      </div>
      <div>
        <input class="text-box-default" type="password" v-model="pw" @keyup.enter="login()" />
      </div>
      <div class="dimmed-msg">
        Wrong password
      </div>
    </div>
    <div class="link" id="forgot-pw">
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

<script>
import api from "@/api"

export default {
  name: "SignInView",
  data() {
    return {
      id: "",
      pw: "",
    }
  },
  methods: {
    goForgotPassword() {
      this.$router.push("/forgotpassword")
    },
    goHome() {
      this.$router.push("/")
    },
    goSignup() {
      this.$router.push("/signup")
    },
    async login() {
      try {
        await api.signIn(this.id, this.pw)
        this.goHome()
      } catch (e) {
        alert(e)
      }
    },
  },
}
</script>
