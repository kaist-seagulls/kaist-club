<template>
  <div class="t-box">
    <div class="t-title">
      SignUpView
    </div>
    <div>
      <label>
        <span>Id</span>
        <input type="id" v-model="id" />
        <span>@kaist.ac.kr</span>
      </label>
      <button @click="auth" :disabled="timeLeft">AUTH</button>
      <input type="text" v-model="code" />
      <span v-if="timeLeft">{{ authStatus }}</span>
    </div>
    <div>
      <span>Password</span>
      <input type="password" v-model="pw" />
    </div>
    <div v-if="!isStrongPw">
      Password must be at least 8 characters including letters and numbers.
    </div>
    <div>
      <span>Confirm password</span>
      <input type="password" v-model="confirmPw" />
    </div>
    <div v-if="!pwConfirmed">
      Values do not match.
    </div>
    <div>
      <span>Phone number</span>
      <input type="tel" v-model="phone" />
    </div>
    <div>
      <button @click="signup()">
        Signup
      </button>
    </div>
  </div>
</template>

<script setup>
import axios from "axios"
import { ref, computed } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()


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

function auth() {
  if (id.value) {
    axios
      .post("/check-auth-code")
      .then(() => {
        timeLeft.value = 5
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
function signup() {
  if (isStrongPw.value && pwConfirmed.value && code.value) {
    axios
      .post("/sign-up", {
        userId: id,
        code,
        password: pw,
        phone,
      })
      .then(() => {
        goSignin()
      })
      .err(err => {
        alert(err)
        console.log(err)
      })
    // goSignin()
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