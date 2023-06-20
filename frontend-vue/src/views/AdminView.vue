<template>
  <div class="flex-nav-bar">
    <div class="logo-fixed">
      <img :src="require('@/assets/KAIST-Logo.wine.svg')" width="100">
    </div>
  </div>
  <div class="flex-admin">
    <div class="admin-columns">
      <div class="admin-heading">
        CURRENT CLUBS
      </div>
      <div class="admin-box">
        <div class="admin-items" v-for="name in currentClubs" v-bind:key="name">
          {{ name }}
          <div class="admin-red-click" @click="deleteClub(name)">
            delete
          </div>
        </div>
      </div>

    </div>
    <div class="admin-columns">
      <div class="admin-heading">
        REQUEST FOR NEW CLUBS
      </div>
      <div class="admin-box">
        <div class="admin-items" v-for="(request, id) in requestsNewClub" v-bind:key="id">
          <div>
            {{ request.clubName }}
            <div class="admin-description">
              <div>
                Requester: {{ request.userId }}
              </div>
              <div>
                Description: {{ request.descriptions }}
              </div>
            </div>
          </div>
          <div class="admin-clicks">
            <div class="admin-red-click" @click="denyNewClub(id)">
              deny
            </div>
            <div class="admin-blue-click" @click="acceptNewClub(id)">
              approve
            </div>
          </div>

        </div>
      </div>
    </div>
    <div class="admin-columns">
      <div class="admin-heading">
        REQUEST FOR HANDOVER
      </div>
      <div class="admin-box">
        <div class="admin-items" v-for="(request, id) in requestsHandover" v-bind:key="id">
          <div>
            {{ request.clubName }}
            <div class="admin-description">
              <span>{{ request.fromId }}</span>
              <span> -> </span>
              <span>{{ request.toId }}</span>
            </div>
          </div>
          <div class="admin-clicks">
            <div class="admin-red-click" @click="denyHandover(id)">
              deny
            </div>
            <div class="admin-blue-click" @click="acceptHandover(id)">
              approve
            </div>
          </div>

        </div>
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