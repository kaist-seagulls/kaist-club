<template>
  <div class="t-box">
    <div class="t-title">
      ForgotPasswordView
    </div>
    <div>
      <label>
        <span>Id</span>
        <input
          type="id"
          v-model="id"
        />
        <span>@kaist.ac.kr</span>
      </label>
      <button @click="auth" :disabled="timeLeft">AUTH</button>
      <input
          type="text"
          v-model="code"
        />
      <span v-if="timeLeft">{{ authStatus }}</span>
    </div>
    <div>
      <span>New pw</span>
        <input
          type="password"
          v-model="newPw"
        />
    </div>
    <div>
      <span>Confirm new pw</span>
        <input
          type="password"
          v-model="confirmNewPw"
        />
    </div>
    <div>
      <button @click="changePw()">
        Change password
      </button>
    </div>
  </div>
</template>

<script setup>
//import axios from 'axios'
import { ref, computed} from "vue"
import { useRouter } from "vue-router"

const router = useRouter()

const id = ref("")
const newPw = ref("")
const confirmNewPw = ref("")
const code = ref("")
const authStatus = computed(() => "wait for resend: " + timeLeft.value + "s")
const timeLeft = ref(0)
const pwConfirmed = computed(() => newPw.value == confirmNewPw.value)

function authTimer() {
  if (timeLeft.value) {
    timeLeft.value--
    setTimeout(authTimer, 1000)
  }
}
function auth() {
  if (id.value) {
    // axios
    //   .post('/check-auth-code')
    //   .then(() => {
    //     timeLeft = 5
    //     setTimeout(authTimer, 1000)
    //     authStatus = computed(() => {return 'wait for resend: ' + timeLeft})
    //   })
    //   .catch(err => {
    //     alert(err)
    //     console.log(err)
    //   })
    timeLeft.value = 5
    setTimeout(authTimer, 1000)
  }
}
function changePw() {
  if (newPw.value && pwConfirmed.value && code.value) {
    // axios
    //   .post('/reset-password', {
    //     id,
    //     code,
    //     pw: newPw,
    //   })
    //   .then(() => {
    //     // setSession()
    //     goSignin()
    //   })
    //   .err(err => {
    //     alert(err)
    //     console.log(err)
    //   })
    goSignin()
  } else if (!newPw.value || !pwConfirmed.value){
    alert("Please confirm your new password")
  } else {
    alert("Type the authentication code: Please check your email box")
  }
}
function goSignin() {
  router.push("/signin")
}

</script>
