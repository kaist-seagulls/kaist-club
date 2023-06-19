<template>
  <div class="flex-create-post flex-slot">
    <div class="create-post-box">
      <div class="page-title">
        Add New Post
      </div>
      <div class="create-post-inner-box">
        <div class="box-left">
          <div class="title-input-section">
            <div class="title-text">
              Title:
            </div>
            <div style="width: 100%;">
              <input class="title-text-box" type="text" v-model="title">
            </div>
          </div>
          <div>
            <input class="pic-upload" type="file" accept="image/png, image/jpeg" @change="changeFile" multiple>
          </div>
          <div class="img-box">
            <div v-for="(file, index) in files" v-bind:key="index">
              <img class="img-setting" :src="imgUrls[index]">
            </div>
          </div>
          <div class="content-input-section">
            <div class="title-text">
              Contents
            </div>
            <div style="width: 100%;">
              <input class="content-text-box" type="text" v-model="content">
            </div>
          </div>
        </div>
        <div class="box-right">
          <div>
            <div class="post-checkbox">
              <div>
                <input class="checkbox" type="checkbox" v-model="isRecruitment">
              </div>
              <div class="tag" id="recruitment">
                RECRUITMENT
              </div>
            </div>
          </div>
          <div>
            <div class="post-checkbox">
              <div>
                <input class="checkbox" type="checkbox" v-model="isOnly">
              </div>
              <div class="tag" id="member-only">
                MEMBERS ONLY
              </div>
            </div>
          </div>
          <div>
            <div class="post-checkbox">
              <div>
                <input class="checkbox" type="checkbox" v-model="isScheduleIncluded">
              </div>
              <div class="tag" id="schedule">
                SCHEDULE
              </div>
            </div>
            <div v-if="isScheduleIncluded">
              <div class="date-picker">
                <div class="date-picker-text">
                  Start
                </div>
                <div>
                  <input type="date" v-model="startDate" @change="checkDate">
                </div>
              </div>
              <div class="date-picker">
                <div class="date-picker-text">
                  End
                </div>
                <div>
                  <input type="date" v-model="endDate" @change="checkDate">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <button class="big-blue-button" @click="post()">Post</button>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/api"
import { mapActions, mapGetters } from "vuex"

export default {
  name: "SignInView",
  data() {
    return {
      title: "",
      files: [],
      isScheduleIncluded: false,
      isRecruitment: false,
      startDate: null,
      endDate: null,
      isOnly: false,
      content: "",
      imgUrls: [],
    }
  },
  computed: {
    ...mapGetters({
      userInfo: "userInfo",
    }),
  },
  methods: {
    ...mapActions({
      fetchUserInfo: "fetchUserInfo",
    }),
    async post() {
      try {
        await api.createPost(
          this.userInfo.representingClub,
          {
            title: this.title,
            isRecruitment: this.isRecruitment,
            isOnly: this.isOnly,
            content: this.content,
            schedule: {
              startDate: this.startDate,
              endDate: this.endDate,
            },
          },
          this.files,
        )
        alert("Post uploaded")
        this.goHome()
      } catch (err) {
        alert(err)
        console.log(err)
      }
    },
    addFile() {
      this.files.push(null)
    },
    removeFile(index) {
      this.files.splice(index, 1)
    },
    changeFile(event) {
      this.files = event.target.files || event.dataTransfer.files
      for (const file of this.files) {
        const url = URL.createObjectURL(file)
        this.imgUrls.push(url)
      }
    },
    checkDate(event) {
      if (this.startDate > this.endDate) {
        alert("startDate cannot be later than endDate")
        event.target.value = event.target.defaultValue
      }
    },
    goHome() {
      this.$router.push("/")
    },
  },
}
</script>
