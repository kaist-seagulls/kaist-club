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

<script>
import { useRouter } from "vue-router"
const router = useRouter()
const strongPassword = /(?=.{8,})(?=.*[0-9])((?=.*[a-z])|(?=.*[A-Z]))/

export default {
  data() {
    return {
      newPw: "",
      confirmNewPw: "",
    }
  },
  computed: {
    isStrongPw() {
      return strongPassword.test(this.newPw)
    },
    pwConfirmed() {
      return this.newPw == this.confirmNewPw
    },
  },
  methods: {
    goSignin() {
      router.push("/signin")
    },
    changePw() {
      if (this.newPw && this.pwConfirmed) {
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
        this.goSignin()
      } else if (!this.newPw || !this.pwConfirmed) {
        alert("Please confirm your new password")
      } else {
        alert("Type the authentication code: Please check your email box")
      }
    },
  },
}
</script>
