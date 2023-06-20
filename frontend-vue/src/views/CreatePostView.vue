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
            <button>
              <label for="create-post-view-file-input">
                <div>
                  Upload images (PNG/JPEG)
                </div>
              </label>
            </button>
            <input type="file" id="create-post-view-file-input" accept="image/png, image/jpeg" @change="changeFile"
              multiple style="display: none">
          </div>
          <div class="img-box">
            <div v-for="(url, index) in imgUrls" v-bind:key="index">
              <div class="img-wrapper" @mouseenter="mouseEnterImage(index)" @mouseleave="mouseLeaveImage(index)">
                <div class="img-delete-overlay" v-if="isMouseOver[index]">
                  <div class="img-delete-button" @click="removeFile(index)">
                    <div class="img-delete-button-text">
                      Delete
                    </div>
                  </div>
                </div>
                <img class="img-setting" :src="url">
              </div>
            </div>
          </div>
          <div class="content-input-section">
            <div class="title-text">
              Contents
            </div>
            <div style="width: 100%;">
              <textarea class="content-text-box" v-model="content" />
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
      isMouseOver: [],
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
    removeFile(index) {
      this.files.splice(index, 1)
      this.imgUrls.splice(index, 1)
      this.isMouseOver.splice(index, 1)
    },
    changeFile(event) {
      console.log("changeFile")
      const newFiles = event.target.files
      this.files = this.files.concat(newFiles)
      for (const file of newFiles) {
        const url = URL.createObjectURL(file)
        this.imgUrls.push(url)
        this.isMouseOver.push(false)
      }
      console.log(this.files)
      for (const imgUrl of this.imgUrls) {
        console.log(imgUrl)
      }
      event.target.value = null
    },
    mouseEnterImage(index) {
      this.isMouseOver[index] = true
    },
    mouseLeaveImage(index) {
      this.isMouseOver[index] = false
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
