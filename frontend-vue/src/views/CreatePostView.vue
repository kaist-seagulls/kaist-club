<template>
  <div class="t-box t-flex-g1">
    <div class="t-title">
      CreatePostView
    </div>
    <div>
      ToFill: CreatePostView Inners
    </div>
    <div>
      <div>
        title:
      </div>
      <div>
        <input type="text" v-model="Title">
      </div>
    </div>
    <div>
      <input type="file" accept="image/png, image/jpeg" @change="changeFile" multiple>
    </div>
    <div v-for="(file, index) in files" v-bind:key="index">
      <img :src="imgUrls[index]" style="height:100px">
    </div>
    <div>
      <div>
        <input type="checkbox" v-model="isScheduleIncluded">
        <div>
          Include schedule data
        </div>
      </div>
      <div v-if="isScheduleIncluded">
        <div>
          <div>
            startDate:
          </div>
          <div>
            <input type="date" v-model="startDate" @change="checkDate">
          </div>
        </div>
        <div>
          <div>
            endDate:
          </div>
          <div>
            <input type="date" v-model="endDate" @change="checkDate">
          </div>
        </div>
      </div>
    </div>
    <div>
      <div>
        Contents:
      </div>
      <div>
        <input type="text">
      </div>
    </div>
  </div>
</template>

<script>
//import api from "@/api"

export default {
  name: "SignInView",
  data() {
    return {
      title: "",
      files: [],
      isScheduleIncluded: false,
      startDate: new Date(),
      endDate: new Date(),
      content: "",
      imgUrls: [],
    }
  },
  methods: {
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
  },
}
</script>
