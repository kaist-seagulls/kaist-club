<template>
  <div class="logo-fixed">
    <img :src="require('@/assets/KAIST-Logo.wine.svg')" width="100">
  </div>
  <div class="flex-log">
    <div class="heading-log">
      Sign Up
    </div>
    <div class="input-group">
      <div class="input-heading">
        <div>
          Email
        </div>
        <div class="star" id="email-star">
          *
        </div>
      </div>
      <div class="many-elements-input">
        <input v-if="isAuthenticated == false" class="text-box-default" type="id" v-model="id" />
        <input v-else class="text-box-blocked" type="id" v-model="id" />
        <div class="kaist-mail">
          @kaist.ac.kr
        </div>
        <button v-if="isAuthenticated == false" class="blue-button" @click="askCode()" :disabled="timeLeft">
          {{ timeLeft ? timeLeft + 's' : 'AUTH' }}
        </button>
        <button v-if="isAuthenticated == true" class="blue-button-blocked" @click="askCode()" disabled>
          AUTH
        </button>
        <input v-if="isAuthenticated == false" class="text-box-default" id="AUTH-text-box" type="text" v-model="code" />
        <input v-else class="text-box-blocked" id="AUTH-text-box" type="text" v-model="code" />
        <button v-if="isAuthenticated == false" class="blue-button" @click="auth()">
          Confirm
        </button>
        <button v-else class="blue-button-blocked" @click="auth()">
          Confirm
        </button>
      </div>
    </div>
    <div class="input-group">
      <div class="input-heading">
        <div>
          Password
        </div>
        <div class="star">
          *
        </div>
      </div>
      <input class="text-box-default" type="password" v-model="pw" />
      <div class="red-msg" v-if="!isStrongPw">
        Password must be at least 8 characters including letters and numbers.
      </div>
      <div class="dimmed-msg" v-else>
        Password must be at least 8 characters including letters and numbers.
      </div>
    </div>
    <div class="input-group">
      <div class="input-heading">
        <div>
          Confirm password
        </div>
        <div class="star">
          *
        </div>
      </div>
      <input v-if="!pwConfirmed" class="text-box-wrong" type="password" v-model="confirmPw" />
      <input v-else class="text-box-default" type="password" v-model="confirmPw" />
      <div class="red-msg" v-if="!pwConfirmed">
        Values do not match
      </div>
      <div class="dimmed-msg" v-else>
        Values do not match
      </div>
    </div>
    <div class="input-group">
      <div class="input-heading">
        Phone number
      </div>
      <div>
        <input class="text-box-default" type="tel" v-model="phone" />
      </div>
    </div>
    <div>
      <button class="big-blue-button" @click="signup()">
        Signup
      </button>
    </div>
    <div class="link">
      <a @click="goSignin()">
        Sign in
      </a>
    </div>
  </div>
</template>

<script>
import api from "@/api"

const strongPassword = /(?=.{8,})(?=.*[0-9])((?=.*[a-z])|(?=.*[A-Z]))/

export default {
  data() {
    return {
      id: "",
      pw: "",
      confirmPw: "",
      phone: "",
      code: "",
      timeLeft: 0,
      isAuthenticated: false,
    }
  },
  computed: {
    authStatus() {
      return "wait for resend: " + this.timeLeft
    },
    isStrongPw() {
      return strongPassword.test(this.pw)
    },
    pwConfirmed() {
      return this.pw === this.confirmPw
    },
  },
  methods: {
    authTimer() {
      if (this.timeLeft) {
        this.timeLeft -= 1
        setTimeout(this.authTimer, 1000)
      }
    },
    async askCode() {
      if (this.id) {
        try {
          await api.sendAuthCode(this.id, "signUp")
          this.timeLeft = 30
          setTimeout(this.authTimer, 1000)
        } catch (e) {
          alert(e)
        }
      }
    },
    async auth() {
      if (this.id) {
        if (this.code) {
          try {
            await api.checkAuthCode(this.id, this.code)
            this.isAuthenticated = true
            alert("AUTHENTICATED!")
          } catch (e) {
            alert(e)
          }
        }
      }
    },
    async signup() {
      if (!this.pw) {
        alert("Enter your password")
      } else if (!this.isStrongPw) {
        alert("Please check your password is valid")
      } else if (!this.pwConfirmed) {
        alert("Please check your password confirmation")
      } else {
        try {
          await api.signUp(this.id, this.code, this.pw, this.phone)
          this.goSignin()
        } catch (e) {
          alert(e)
        }
      }
    },
    goSignin() {
      this.$router.push("/signin")
    },
  },
}
</script>