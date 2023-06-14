<template>
  <div class="t-box">
    <div class="t-title">
      ForgotPasswordView
    </div>
    <div>
      <label>
        <span>Id</span>
        <input type="id" v-model="id" @change="timeLeft = 0" />
        <span>@kaist.ac.kr</span>
      </label>
      <button @click="auth" :disabled="timeLeft">{{ timeLeft ? timeLeft + 's' : 'AUTH' }}</button>
      <input type="text" v-model="code" />
      <button @click="confirm">confirm</button>
    </div>
    <div>
      <span>New pw</span>
      <input type="password" v-model="newPw" />
    </div>
    <div v-if="!isStrongPw">
      Password must be at least 8 characters including letters and numbers.
    </div>
    <div>
      <span>Confirm new pw</span>
      <input type="password" v-model="confirmNewPw" />
    </div>
    <div v-if="!pwConfirmed">
      Values do not match.
    </div>
    <div>

    </div>
    <div>
      <button @click="changePw()">
        Change password
      </button>
    </div>
  </div>
</template>

<script setup>
import axios from "axios"
import { ref, computed } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()

const prefix = "/api/v1"

const id = ref("")
const newPw = ref("")
const confirmNewPw = ref("")
const code = ref("")
const timeLeft = ref(0)

const strongPassword = /(?=.{8,})(?=.*[0-9])((?=.*[a-z])|(?=.*[A-Z]))/
const isStrongPw = computed(() => strongPassword.test(newPw.value))
const pwConfirmed = computed(() => newPw.value == confirmNewPw.value)

function authTimer() {
  if (timeLeft.value) {
    timeLeft.value--
    setTimeout(authTimer, 1000)
  }
}
function auth() {
  if (id.value) {
    axios
      .post(prefix + "/send-auth-code", {
        userId: id.value,
        purpose: "forgotPassword",
      })
      .then(() => {
        timeLeft.value = 30
        setTimeout(authTimer, 1000)
      })
      .catch(err => {
        alert(err)
        console.log(err)
      })
  }
}
function confirm() {
  axios
    .post(prefix + "/check-auth-code", {
      userId: id.value,
      code: code.value,
    })
    .then(() => {
      alert("AUTHENTICATED!")
    })
    .catch((err) => {
      // TODO: add a logic for getting remaining time for resending auth.
      alert(err)
      console.log(err)
    })
}
function changePw() {
  if (newPw.value && pwConfirmed.value && code.value) {
    axios
      .post(prefix + "/reset-password", {
        userId: id.value,
        password: newPw.value,
      })
      .then(() => {
        goSignin()
      })
      .catch(err => {
        alert(err)
        console.log(err)
      })
    // goSignin()
  } else if (!newPw.value || !pwConfirmed.value) {
    alert("Please confirm your new password")
  } else {
    alert("Type the authentication code: Please check your email box")
  }
}
function goSignin() {
  router.push("/signin")
}

</script>
