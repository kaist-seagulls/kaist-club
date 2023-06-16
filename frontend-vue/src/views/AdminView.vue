<template>
  <div class="flex-admin">
    <div class="admin-columns">
      <div class="admin-heading">
        CURRENT CLUBS
      </div>
      <div v-for="name in currentClubs" v-bind:key="name">
        {{ name }}
        <span @click="deleteClub(name)">
          delete
        </span>
      </div>
    </div>
    <div class="admin-columns">
      <div class="admin-heading">
        REQUEST FOR NEW CLUBS
      </div>
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
    <div class="admin-columns">
      <div class="admin-heading">
        REQUEST FOR HANDOVER
      </div>
      <div v-for="(request, id) in requestsHandover" v-bind:key="id">
        {{ request.clubName }}
        <div>
          <span>{{ request.fromUserName }}</span>
          <span> -> </span>
          <span>{{ request.toUserName }}</span>
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