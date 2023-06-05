<template>
  <div class="t-box">
    <div class="t-title">
      AdminView
    </div>
    <div>CURRENT CLUBS
      <div v-for="(club, id) in currentClubs" v-bind:key="id">
        {{ club.name }}
        <span @click="deleteClub(id)">
          delete
        </span>
      </div>
    </div>
    <div>REQUEST FOR NEW CLUBS
      <div v-for="(request, id) in requestsNewClub" v-bind:key="id">
        {{ request.clubName }}
        <div>Requester: {{ request.requestUser }}</div>
        <div>Description: {{ request.clubDescription }}</div>
        <span @click="denytNewClub(id)">
          deny
        </span>
        <span @click="accepttNewClub(id)">
          approve
        </span>
      </div>
    </div>
    <div>REQUEST FOR HANDOVER
      <div v-for="(club, id) in requestsHandover" v-bind:key="id">  
        {{ club.name }}
        <div>
          <span>{{ request.fromUserId }}</span>
          <span> -> </span>
          <span>{{ request.toUserId }}</span>
        </div>
        <span @click="denyHandover(id)">
          deny
        </span>
        <span @click="acceptHandover(id)">
          approve
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex"

export default {
  name: "AdminView",
  components: {
  },
  computed: {
    ...mapGetters({
      currentClubs: "currentClubs",
      requestsNewClub: "requestsNewClub",
      requestsHandover: "requestsHandover",
    }),
  },
  methods: {
    ...mapActions({
      fetchAdminInfo: "fetchAdminInfo",
      deleteClub: "deleteClub",
      acceptNewClub: "acceptNewClub",
      denyNewClub: "denyNewClub",
      acceptHandover: "acceptHandover",
      denyHandover: "denyHandover",
    }),
  },
  beforeMount() {
    this.fetchAdminInfo()
  },
}
</script>