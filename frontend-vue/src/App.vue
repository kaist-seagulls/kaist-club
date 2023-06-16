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
  --color-g5: #000000;
}

body {
  margin: 0
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
}

/* Log */
.logo-fixed {
  position: fixed;
  top: 0;
  left: 0;
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

.text-box-wrong {
  border: 1px solid #FF4646;
  background: #FFF3F3;
  border-radius: 5px;
  height: 25pt;
  padding-left: 10px;
  width: 100%;
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

.red-msg {
  display: flex;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 300;
  font-size: 10px;
  line-height: 15px;
  color: #FF4646;
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
/* Calendar start */

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
</style>
