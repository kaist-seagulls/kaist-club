<template>
  <div class="logo-fixed">
    <img :src="require('@/assets/KAIST-Logo.wine.svg')" width="100">
  </div>
  <div class="flex-log">
    <div class="heading-log">
      Forgot Password?
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
        <input v-if="isAuthenticated == false" class="text-box-default" type="id" v-model="id" @change="timeLeft = 0" />
        <input v-else class="text-box-blocked" type="id" v-model="id" @change="timeLeft = 0" disabled />
        <div class="kaist-mail">
          @kaist.ac.kr
        </div>
        <button v-if="isAuthenticated == false" class="blue-button" @click="auth" :disabled="timeLeft">
          {{ timeLeft ? timeLeft + 's' : 'AUTH' }}
        </button>
        <button v-else class="blue-button-blocked" @click="auth" disabled>
          AUTH
        </button>
        <input v-if="isAuthenticated == false" class="text-box-default" id="AUTH-text-box" type="text" v-model="code" />
        <input v-else class="text-box-blocked" id="AUTH-text-box" type="text" v-model="code" disabled />
        <button v-if="isAuthenticated == false" class="blue-button" @click="confirm">
          Confirm
        </button>
        <button v-else class="blue-button-blocked" @click="confirm" disabled>
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
      <input class="text-box-default" type="password" v-model="newPw" />
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
          Confirm New Password
        </div>
        <div class="star">
          *
        </div>
      </div>
      <input class="text-box-default" type="password" v-model="confirmNewPw" />
      <div class="red-msg" v-if="!pwConfirmed">
        Values do not match.
      </div>
      <div class="dimmed-msg" v-else>
        Values do not match.
      </div>
    </div>
    <div>
      <button class="big-blue-button" @click="changePw()">
        Change password
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
import axios from "axios"

const strongPassword = /(?=.{8,})(?=.*[0-9])((?=.*[a-z])|(?=.*[A-Z]))/
const prefix = "/api/v1"

export default {
  name: "ForgotPasswordView",
  data() {
    return {
      id: "",
      newPw: "",
      confirmNewPw: "",
      code: "",
      timeLeft: 0,
      isAuthenticated: false,
    }
  },
  computed: {
    isStrongPw() {
      return strongPassword.test(this.newPw)
    },
    pwConfirmed() {
      return this.newPw === this.confirmNewPw
    },
  },
  methods: {
    authTimer() {
      if (this.timeLeft) {
        this.timeLeft -= 1
        setTimeout(this.authTimer, 1000)
      }
    },
    async auth() {
      if (this.id) {
        console.log(this.id)
        try {
          await axios.post(prefix + "/send-auth-code", {
            userId: this.id,
            purpose: "forgotPassword",
          })
          this.timeLeft = 30
          setTimeout(this.authTimer, 1000)
        } catch (e) {
          alert(e)
        }
      }
    },
    async confirm() {
      try {
        await axios.post(prefix + "/check-auth-code", {
          userId: this.id,
          code: this.code,
        })
        this.isAuthenticated = true
        alert("AUTHENTICATED!")
      } catch (e) {
        alert(e)
      }
    },
    async changePw() {
      if (!this.code) {
        alert("Type the authentication code: Please check your email box")
      } else if (!this.newPw) {
        alert("Enter your new password")
      } else if (!this.isStrongPw) {
        alert("Please confirm your new password")
      } else if (!this.pwConfirmed) {
        alert("Please check your password confirmation")
      } else {
        try {
          await axios.post(prefix + "/reset-password", {
            userId: this.id,
            password: this.newPw,
          })
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
