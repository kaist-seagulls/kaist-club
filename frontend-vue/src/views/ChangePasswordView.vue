<template>
  <div class="flex-change-pw">
    <div class="heading-log">
      Change Password
    </div>
    <div class="input-group">
      <div class="input-heading">
        <div>
          Current
        </div>
        <div class="star">
          *
        </div>
      </div>
      <div>
        <input class="text-box-default" type="password" v-model="oldPw" />
      </div>
    </div>
    <div class="input-group">
      <div class="input-heading">
        <div>
          New Password
        </div>
        <div class="star">
          *
        </div>
      </div>
      <div>
        <input class="text-box-default" type="password" v-model="newPw" />
      </div>
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
      <input v-if="!pwConfirmed" class="text-box-wrong" type="password" v-model="confirmNewPw" />
      <input v-else class="text-box-default" type="password" v-model="confirmNewPw" />
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
  </div>
</template>

<script>
import api from "@/api"
const strongPassword = /(?=.{8,})(?=.*[0-9])((?=.*[a-z])|(?=.*[A-Z]))/

export default {
  data() {
    return {
      newPw: "",
      confirmNewPw: "",
      oldPw: "",
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
    goMain() {
      this.$router.push("/")
    },
    goSignin() {
      this.$router.push("/signin")
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
