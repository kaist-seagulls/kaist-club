<template>
  <div class="t-box">
    <div class="t-title">
      ManageClubView
    </div>
    <div>Manage &lt;{{ userInfo.representing }}&gt;</div>
    <div>APPLICANTS
      <div v-for="userid in applicants" v-bind:key="userid">
        {{ userid }}
        <button @click="acceptJoin(userid)">V</button>
        <button @click="denyJoin(userid)">X</button>
      </div>
    </div>
    <div>MEMBERS
      <div v-for="userid in members" v-bind:key="userid">
        {{ userid }}
        <button @click="getOuttaMyClubDude(userid)">Banish</button>
        <button @click="requestHandover(userid)">Handover</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex"

export default {
  name: "ManageClubView",
  computed: {
    ...mapGetters({
      userInfo: "userInfo",
      members: "members",
      applicants: "applicants",
    }),
  },
  methods: {
    ...mapActions({
      fetchUserInfo: "fetchUserInfo",
      fetchClubManagementInfo: "fetchClubManagementInfo",
      acceptJoin: "acceptJoin",
      denyJoin: "denyJoin",
      getOuttaMyClubDude: "getOuttaMyClubDude",
      requestHandover: "requestHandover",
    }),
  },
  beforeMount() {
    this.fetchUserInfo()
    this.fetchClubManagementInfo()
  },
}
</script>
