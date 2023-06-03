<style>
#signInButton {
  border: none;
  background-color: #18408C;
  color: #FFFFFF;
  text-align: center;
  display: inline-block;
  font-size: 20px;
  font-weight: 400;
  cursor: pointer;
  padding: 11px 25px;
  border-radius: 5px;
}

.flex {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 600px;
  margin-left: 32%;
  margin-right: 32%
}

.textBox {
  width: 570px;
  height: 35px;
  font-size: 18px;
  border-radius: 3px;
  padding-left: 13px;
  box-shadow: none;
  border: 1px solid #D8D8D8;
}

#signIn {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 600;
  font-size: 40px;
  line-height: 58px;
  color: #000000;
  margin-top: 20%;
  margin-bottom: 5%
}

.g3font {
  font-family: 'Inter';
  font-weight: 400;
  font-size: 18px;
  line-height: 22px;
  color: #808080;
}

.textButton {
  font-family: 'Inter';
  font-weight: 300;
  font-size: 18px;
  line-height: 22px;
  text-decoration-line: underline;
  color: #698FC1;
  cursor: pointer;
}

.margin {
  margin: 2.2%
}

#email {
  width: 460px;
  height: 35px;
  font-size: 18px;
  border-radius: 3px;
  padding-left: 13px;
  box-shadow: none;
  border: 1px solid #D8D8D8;
}

#mail {
  margin-left: 10px;
}
</style>
<template>
  <div>
    <img :src="require('@/assets/KAIST-Logo.wine.svg')" width="100">
  </div>
  <div class="flex">
    <div id="signIn">Sign In</div>
    <div class="margin"><label>
        <div style="margin-bottom:1%"><span class="g3font"> Email</span></div>
        <span><input class="textBox" id="email" type="id" v-model="id" /></span>
        <span id="mail">@kaist.ac.kr</span>
      </label></div>
    <div class="margin"><label>
        <div style="margin-bottom:1%"><span class="g3font">Password</span></div>
        <input class="textBox" type="password" v-model="pw" />
      </label></div>
    <div style="margin:1%; align-self: flex-end;">
      <a class="textButton" id="forgotPassword" @click="goForgotPassword()">Forgot password?</a>
    </div>
    <div style="margin:0.5%;"><button id="signInButton" @click="login()">Sign In</button></div>
    <div style="margin:5%;">
      <a class="textButton" @click="goSignup()">Sign up</a>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import axios from "axios"
import { useRouter } from "vue-router"

const router = useRouter()
const prefix = "api/v1/"

const id = ref("")
const pw = ref("")

function goForgotPassword() {
  router.push("/forgotpassword")
}
function goHome() {
  router.push("/")
}
function goSignup() {
  router.push("/sign.valueup")
}
function login() {
  axios
    .post(prefix + "sign-in", {
      userId: id.value,
      password: pw.value,
    })
    .then(() => {
      goHome()
    })
    .catch(err => {
      alert(err)
      console.log(err)
    })
  // goHome()
}
</script>
