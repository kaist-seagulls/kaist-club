<template>
  <component :is="layout">
    <RouterView />
  </component>
</template>

<script setup>
import { computed } from "@vue/reactivity"
import { useRoute } from "vue-router"

const layout = computed(() => useRoute().meta.layout)
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap');

:root {
  --color-g5: #000000
}

body {
  margin: 0;
  height: 100vh;
}

#app {
  font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.t-box {
  border: 1px solid var(--color-g5);
  padding: 5px;
  margin: 5px;
}

.t-title {
  color: dodgerblue;
}

.t-flex-g0 {
  flex-grow: 0;
}

.t-flex-g1 {
  flex-grow: 1;
}

.t-flex {
  display: flex;
  max-height: 100vh;
  overflow: hidden;
}

/* Log */
.logo-fixed {
  position: fixed;
  top: 0;
  left: 50px;
}

.flex-log {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  margin-right: auto;
  margin-left: auto;
  width: 600px;
}

.heading-log {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 600;
  font-size: 40px;
  line-height: 58px;
  color: #000000;

  margin-left: auto;
  margin-right: auto;
  margin-top: 70px;
  margin-bottom: 10px;
}

.input-group {
  margin-top: 5px;
  margin-bottom: 5px;
}

.many-elements-input {
  display: flex;
}

.input-heading {
  display: flex;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 15px;
  line-height: 22px;
  color: #808080;
  white-space: nowrap;
}

.big-blue-button {
  /* button */
  background-color: #18408C;
  border-radius: 5px;
  border: none;
  height: 30pt;
  padding: 0;
  width: 100%;
  margin-top: 15pt;
  margin-bottom: 10pt;
  /* text */
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 15px;
  line-height: 24px;
  color: #FFFFFF;
  cursor: pointer;
}

.blue-button {
  /* button */
  background-color: #18408C;
  border-radius: 5px;
  border: none;
  padding-left: 10px;
  padding-right: 10px;
  margin-left: 10px;
  width: 130px;
  /* text */
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 15px;
  line-height: 24px;
  color: #FFFFFF;
  cursor: pointer;
}

.blue-button-blocked {
  /* button */
  background-color: #0D2959;
  border-radius: 5px;
  border: none;
  padding-left: 10px;
  padding-right: 10px;
  margin-left: 10px;
  width: 130px;
  /* text */
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 15px;
  line-height: 24px;
  color: #000000;
}

.text-box-default {
  border: 1px solid #D8D8D8;
  border-radius: 5px;
  height: 25pt;
  padding-right: 10px;
  padding-left: 10px;
  width: 100%;
  box-sizing: border-box;
}

.text-box-blocked {
  border: 1px solid #000000;
  background: #808080;
  border-radius: 5px;
  height: 25pt;
  padding-right: 10px;
  padding-left: 10px;
  width: 100%;
  box-sizing: border-box;
}

.text-box-default:focus {
  border: 1px solid #D8D8D8;
  background: #F8F8F8;
  border-radius: 5px;
  height: 25pt;
  padding-left: 10px;
  width: 100%;
}

.red-msg {
  display: flex;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 300;
  font-size: 10px;
  line-height: 15px;
  color: #FF4646;
}

.dimmed-msg {
  display: flex;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 300;
  font-size: 10px;
  line-height: 15px;
  color: #FF4646;
  visibility: hidden;
}

.text-box-wrong {
  border: 1px solid #FF4646;
  background: #FFF3F3;
  border-radius: 5px;
  height: 25pt;
  padding-left: 10px;
  width: 100%;
  box-sizing: border-box;
}

#forgot-pw {
  margin-right: 0;
  margin-top: 0;
  margin-bottom: 0;
}

.link {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 300;
  font-size: 15px;
  line-height: 22px;
  text-decoration-line: underline;
  color: #698FC1;

  margin-left: auto;
  margin-right: auto;
  margin-top: 10px;
  margin-bottom: 10px;

  cursor: pointer;
}

.kaist-mail {
  display: flex;
  align-items: center;
  margin-left: 10px;

  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 15px;
  line-height: 22px;
  color: #303030;
}

#AUTH-text-box {
  width: 80px;
  margin-left: 10px;
}

.star {
  width: 100%;
  text-align: right;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 22px;
  color: #FF4646;
}

#email-star {
  width: 215px;
}

/* LOG fin */

/* ChangePW start */
.flex-change-pw {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  margin-right: auto;
  margin-left: auto;
  width: 600px;
}

/* Changepw fin */

/* Calendar start */
.flex-calendar {
  padding-top: 100px;
  height: calc(100vh - 55px);
  flex: 1 0 auto;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  box-sizing: border-box;
}

.calendar-view {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  margin-right: auto;
  margin-left: auto;
  margin-bottom: 100px;
  width: 800px;

}

.calendar-heading {
  display: flex;
  justify-content: center;
}

.arrow-button {
  border: none;
  background-color: #FFFFFF;
  cursor: pointer;
}

.calendar-4-week {
  display: grid;
  grid-template: 40px repeat(4, minmax(70px, auto))/repeat(7, 1fr);
  border-top: 2px solid #303030;
  border-bottom: 1px solid #808080;
  background-color: #D8D8D8;
  grid-gap: 1px;
}

.calendar-5-week {
  display: grid;
  grid-template: 40px repeat(5, minmax(70px, auto))/repeat(7, 1fr);
  border-top: 2px solid #303030;
  border-bottom: 1px solid #808080;
  background-color: #D8D8D8;
  grid-gap: 1px;
}

.calendar-6-week {
  display: grid;
  grid-template: 40px repeat(6, minmax(70px, auto))/repeat(7, 1fr);
  border-top: 2px solid #303030;
  border-bottom: 1px solid #808080;
  background-color: #D8D8D8;
  grid-gap: 1px;
}

.calendar-4-week>* {
  background-color: #FFFFFF;
}

.calendar-5-week>* {
  background-color: #FFFFFF;
}

.calendar-6-week>* {
  background-color: #FFFFFF;
}

.calendar-heading-text {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 58px;
  color: #000000;
  margin: 10px;
}


.day-of-week {
  display: flex;
  justify-content: center;
  padding: 5px;
  background-color: #F8F8F8;
  border-bottom: 1px solid #D8D8D8;

  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-size: 15px;
  color: #000000;
  align-items: center;
  text-align: center;
}

.calendar-flex {
  display: flex;
  padding: 10px;

  align-items: flex-start;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  color: #000000;
}

.event {
  display: flex;
  align-items: center;
  padding: 5px;
  padding-left: 15px;
  height: 20px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  color: #000000;
  background-color: #ffd3bd;
}

.day-of-week:nth-child(7n+1) {
  color: #A4423E;
}

.day-of-week:nth-child(7n) {
  color: #18408C;
}


#dimmed-date {
  visibility: hidden;
}

/* Calendar fin */
/* Admin start */
.flex-admin {
  display: flex;
  justify-content: space-between;
  padding-top: 30px;
  width: 100vw;
  height: 100vh;
  box-sizing: border-box;
}

.admin-heading {
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 800;
  font-size: 25px;
  color: #000000;
  margin-bottom: 20px;
}

.admin-columns {
  display: flex;
  flex-direction: column;
  padding-left: 20px;
  padding-right: 20px;
  flex-grow: 1;
  box-sizing: border-box;
  overflow-y: scroll;
}

/* Admin fin */

/* NavBar start */
.flex-nav-bar {
  top: 0;
  position: fixed;
  display: flex;
  background-color: #EFF1FE;
  width: 100vw;
  height: 55px;
  justify-content: flex-end;
  align-items: center;

}

.nav-main {
  margin-left: 300px;
  margin-right: auto;
}

.nav-button {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  background-color: transparent;
  border-color: transparent;
  margin-left: 15px;
  margin-right: 15px;
  cursor: pointer;
  height: 55px;

  font-weight: 400;
  font-size: 15px;
  color: #698FC1;

}

#nav-button-selected {
  font-weight: 800;
  border-bottom: 3px solid #18408C;
  color: #18408C;
}

.nav-icon {
  margin-right: 10px;
}

/* NavBar fin */
/* FilterBox start */
.flex-filter-box {
  display: flex;
  margin-top: 55px;
  height: calc(100vh - 55px);
  flex-direction: column;
  justify-content: space-between;
  width: 310px;
  box-sizing: border-box;
  border-right: 1px solid #D8D8D8;
}

.filter {
  display: flex;
  flex-direction: column;
}

.search-bar {
  display: flex;
  margin: 50px 40px 20px 40px;
  padding-bottom: 10px;
  height: 30px;
  border-bottom: 1px solid #D8D8D8;
}

.search-text-box {
  background: #F8F8F8;
  border: 1px solid #D8D8D8;
  border-radius: 9px;
  height: 25px;
  padding-right: 10px;
  padding-left: 10px;
  box-sizing: border-box;
  width: 100%;
  font-size: 15px;
  margin-right: 5px;
}

.search-button {
  color: #303030;
  background: #D8D8D8;
  border: 1px solid #303030;
  border-radius: 9px;
  height: 25px;

}

.filter-box {
  padding: 0px 40px 0px 40px;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: auto;
  white-space: nowrap;
}

.filter-heading {
  display: flex;
  justify-content: space-between;
  font-weight: 500;
  font-size: 15px;
  color: #000000;

  margin-top: 30px;
  border-bottom: 1px solid #D8D8D8;
  padding-left: 10px;
  padding-bottom: 10px;
}

#all-kaist-clubs {
  margin-left: 40px;
  margin-right: 40px;
  padding-top: 20px;
  padding-bottom: 20px;
  border-bottom: transparent;
  border-top: 1px solid #D8D8D8;
  box-sizing: border-box;
}

.filter-option-box {
  padding-left: 10px;
  display: flex;
  margin-top: 10px;
}

.filter-profile {
  padding: 0;
  cursor: pointer;
  background-color: transparent;
  border: transparent;
  font-weight: 400;
  font-size: 15px;
  color: #808080;
}

.check-box-pic {
  cursor: pointer;
  padding: 0;
  border: transparent;
  background-color: transparent;
}

/* FilterBox fin */

/* Main start */
.flex-slot {
  flex: 1 0 auto;
}

.flex-main {
  display: flex;
  margin-top: 55px;
  height: calc(100vh - 55px);
  flex-direction: column;
  justify-content: space-between;
  overflow-y: auto;
  white-space: nowrap;
  box-sizing: border-box;
}

.post {
  margin: 50px 80px 50px 80px;
  border: transparent;
}

.post-club {
  display: flex;
  font-weight: 700;
  font-size: 30px;
  line-height: 48px;
  color: #000000;
}

.club-profile {
  border-radius: 50%;
  margin-right: 20px;
}

.post-box {
  display: flex;
  flex-direction: column;
  padding: 20px 20px 10px 20px;
  background: #F6F6F9;
}

.post-heading {
  display: flex;
  flex-direction: column;
}

.tag {
  font-weight: 400;
  font-size: 15px;
  color: #FFFFFF;
  padding: 5px 10px 5px 10px;

  border-radius: 5px;
  width: fit-content;

}

#recruitment {
  background-color: #698FC1;
}

#member-only {
  background-color: #0D2959;
}

#schedule {
  background-color: #11294B;
}

.date {
  display: flex;
  font-weight: 400;
  font-size: 15px;
  color: #11294B;
}

.post-title {
  display: flex;
  justify-content: space-between;
  font-weight: 600;
  font-size: 20px;
  color: #303030;
  padding-bottom: 5px;
  border-bottom: 2px solid #18408C;
  margin-top: 10px;
  margin-bottom: 20px;
}

.content {
  display: flex;
  height: 350px;
}

.content-text {
  white-space: wrap;
  padding: 20px;
  margin-right: 20px;
  width: 300px;
  height: 100%;
  background-color: #FFFFFF;
  box-sizing: border-box;
}

.content-pic-box {
  height: 100%;
  width: 100%;
  overflow-y: hidden;
  overflow-x: auto;
}

.content-pic {
  margin-right: 20px;
  height: 100%;
}

.upload-time {
  display: flex;
  justify-content: flex-end;
  font-size: 10px;
  font-weight: 300;
  color: #808080;
}

.time {
  margin-left: 5px;
}

.pagination {
  display: flex;
  margin-left: auto;
  margin-right: auto;
  padding: 50px;
}

.page-button {
  font-size: 15px;
  cursor: pointer;
  border: transparent;
  padding-bottom: 5px;
  border-bottom: 2px solid #808080;
  background-color: transparent;
}

/* Main fin */
/* UserProfile start */
.flex-user-profile {
  display: flex;
  margin-top: 55px;
  height: calc(100vh - 55px);
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
}

.user-profile-box {
  display: flex;
  flex-direction: column;
}

/* UserProfile fin */
/* CreatePost start */
.flex-create-post {
  display: flex;
  margin-top: 55px;
  height: calc(100vh - 55px);
  flex-direction: column;
  overflow-y: auto;
  white-space: nowrap;
  box-sizing: border-box;
}

.create-post-box {
  margin: 30px 80px 30px 80px;
}

.page-title {
  width: 100%;
  margin-bottom: 15px;
  font-weight: 600;
  font-size: 20px;
  color: #000000;
}

.create-post-inner-box {
  display: flex;
}

.box-left {
  padding: 15px;
  width: 80%;
  background-color: #F6F6F9;
  margin-right: 20px;
  box-sizing: border-box;
}

.box-right {
  display: flex;
  flex-direction: column;
  width: 20%;
  padding: 15px;
  background-color: #F6F6F9;
  box-sizing: border-box;
}

.post-checkbox {
  display: flex;
  margin-top: 10px;
  align-items: center;
}

.checkbox {
  width: 15px;
  height: 15px;
  border: 1px solid #D8D8D8;
  border-radius: 5px;
  margin-right: 10px;
}

.title-input-section {
  display: flex;
  width: 100%;
  margin-bottom: 20px;
}

.title-text {
  display: flex;
  align-items: center;
  font-weight: 500;
  font-size: 16px;
  color: #303030;
  margin-right: 10px;
}

.title-text-box {
  border: 1px solid #D8D8D8;
  border-radius: 5px;
  height: 30px;
  padding-right: 10px;
  padding-left: 10px;
  box-sizing: border-box;
  width: 100%;
  font-size: 15px;
}

.pic-upload {
  cursor: pointer;
}

.date-picker {
  margin-top: 10px;
}

.date-picker-text {
  font-weight: 300;
  font-size: 13px;
  color: #303030;
}

.img-box {
  display: flex;
  background-color: #FFFFFF;
  padding: 10px;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  border: 1px solid #D8D8D8;
  border-radius: 5px;
  height: 220px;
  margin-top: 5px;
}

.img-setting {
  margin: 10px;
  width: 200px;
  height: 200px;
  object-fit: cover;
}

.content-input-section {
  align-items: flex-start;
  width: 100%;
  margin-top: 20px;
  margin-bottom: 10px;
}

.content-text-box {
  border: 1px solid #D8D8D8;
  border-radius: 5px;
  height: 100px;
  padding-right: 10px;
  padding-left: 10px;
  box-sizing: border-box;
  width: 100%;
}

/* CreatePost fin */
</style>
