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
import api from "@/api"
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
    goMain() {
      router.push("/")
    },
    async changePw() {
      if (this.newPw && this.pwConfirmed) {
        try {
          await api.updateUserPassword(this.oldPw, this.newPw)
          alert("Password changed successfully")
          this.goMain()
        } catch (err) {
          alert(err)
          console.log(err)
        }
      } else if (!this.newPw || !this.pwConfirmed) {
        alert("Please confirm your new password")
      } else {
        alert("Type the authentication code: Please check your email box")
      }
    },
  },
}
</script>
