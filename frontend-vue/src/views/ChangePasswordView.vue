<template>
  <div class="t-box">
    <div class="t-title">
      ChangePasswordView
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
      <button @click="changePw()">
        Change password
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()

const newPw = ref("")
const confirmNewPw = ref("")

const strongPassword = /(?=.{8,})(?=.*[0-9])((?=.*[a-z])|(?=.*[A-Z]))/
const isStrongPw = computed(() => strongPassword.test(newPw.value))
const pwConfirmed = computed(() => newPw.value == confirmNewPw.value)

function changePw() {
  if (newPw.value && pwConfirmed.value) {
    // axios
    //   .post("/reset-password", {
    //     userId: id,
    //     code,
    //     password: newPw,
    //   })
    //   .then(() => {
    //     goSignin()
    //   })
    //   .err(err => {
    //     alert(err)
    //     console.log(err)
    //   })
    alert("Password changed. Go to signin page.")
    goSignin()
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
