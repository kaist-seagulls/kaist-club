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
        <input class="text-box-default" type="id" v-model="id" />
        <div class="kaist-mail">
          @kaist.ac.kr
        </div>
        <button class="blue-button" @click="askCode()" :disabled="timeLeft">
          AUTH
        </button>
        <span v-if="timeLeft">{{ authStatus }}</span>
        <input class="text-box-default" id="AUTH-text-box" type="text" v-model="code" />
        <button class="blue-button" @click="auth()">Confirm</button>
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
      <input class="text-box-default" type="password" v-model="confirmPw" />
      <div class="red-msg" v-if="!pwConfirmed">
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
      <a @click="goSignin()">Sign in</a>
    </div>
  </div>
</template>

<script setup>
import axios from "axios"
import { ref, computed } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()

const prefix = "/api/v1/"

const id = ref("")
const pw = ref("")
const confirmPw = ref("")
const phone = ref("")
const code = ref("")
const authStatus = computed(() => "wait for resend: " + timeLeft.value + "s")
const timeLeft = ref(0)

const strongPassword = /(?=.{8,})(?=.*[0-9])((?=.*[a-z])|(?=.*[A-Z]))/
const isStrongPw = computed(() => strongPassword.test(pw.value))
const pwConfirmed = computed(() => pw.value === confirmPw.value)

function authTimer() {
  if (timeLeft.value) {
    timeLeft.value--
    setTimeout(authTimer, 1000)
  }
}

function askCode() {
  if (id.value) {
    axios
      .post(prefix + "send-auth-code", {
        userId: id.value,
        purpose: "signUp",
      })
      .then(() => {
        timeLeft.value = 30
        setTimeout(authTimer, 1000)
      })
      .catch(err => {
        alert(err)
        console.log(err)
      })
    // timeLeft.value = 5
    // setTimeout(authTimer, 1000)
  }
}
async function auth() {
  if (id.value) {
    if (code.value) {
      try {
        await axios.post(
          prefix + "check-auth-code",
          { userId: id.value, code: code.value },
        )
        alert("Authenticated!")
      } catch (e) {
        alert(e)
      }
    }
  }
}
async function signup() {
  if (isStrongPw.value && pwConfirmed.value && code.value) {
    try {
      await axios.post(
        prefix + "sign-up",
        {
          userId: id.value,
          password: pw.value,
          phone: phone.value,
        },
      )
      goSignin()
    } catch (e) {
      alert(e)
    }
  } else if (!isStrongPw.value || !pwConfirmed.value) {
    alert("Please confirm your new password")
  } else {
    alert("Type the authentication code: Please check your email box")
  }
}
function goSignin() {
  router.push("/signin")
}
</script>