<template>
  <div class="flex-main">
    <div>
      <div class="post" v-for="post in searchResult.posts" :key="post.postId">
        <div class="post-club">
          <div>
            <img class="club-profile" :src="require('@/assets/NumberProfile.png')" width="50">
          </div>
          {{ post.clubName }}
        </div>
        <div class="post-box">
          <div class="post-heading">
            <div>
              <div class="tag" id="recruitment" v-if="post.isRecruit">
                RECRUITMENT
              </div>
              <div class="tag" id="member-only" v-if="post.isOnly">
                MEMBER ONLY
              </div>
            </div>
            <div class="post-title">
              {{ post.title }}
              <div class="date">
                <div v-if="post.scheduleStart">
                  {{ (new Date(post.scheduleStart)).getFullYear() + "/" + (new Date(post.scheduleStart)).getMonth() + "/"
                    + (new
                      Date(post.scheduleStart)).getDate() }}
                </div>
                <div>
                  -
                </div>
                <div v-if="post.scheduleEnd">
                  {{ (new Date(post.scheduleEnd)).getFullYear() + "/" + (new Date(post.scheduleEnd)).getMonth() +
                    "/"
                    + (new
                      Date(post.scheduleEnd)).getDate() }}
                </div>
              </div>
            </div>
          </div>
          <div class="content">
            <div class="content-text">
              {{ post.contents }}
            </div>
            <!-- <div class="content-pic-box">
              <img v-for="link in getImages(post.postId, post.clubName)" v-bind:key="link" class="content-pic" :src="link"
                width="300">
              <img class="content-pic" :src="require('@/assets/NumberProfile.png')" width="300">
            </div> -->
            <div class="content-pic-box">
              <!-- <img v-for="link in post.images" :key="link" class="content-pic" :src="link" width="300"> -->
              <img v-for="image of post.images" :key="image"
                :src="'/api/v1/images/post/' + String(post.postId) + '/' + image" class="content-pic" width="300" />
              <!-- <img class="content-pic" :src="require('@/assets/NumberProfile.png')" width="300"> -->
            </div>
          </div>
          <div class="upload-time">
            <div>
              {{ (new Date(post.uploadTime)).getFullYear() + "/" + (new Date(post.uploadTime)).getMonth() + "/" + (new
                Date(post.uploadTime)).getDate() }}
            </div>
            <div class="time">
              {{ (new Date(post.uploadTime)).getHours() + ":" + (new Date(post.uploadTime)).getMinutes() }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="pagination">
      <template v-for="page in pagination.pages" :key="page">
        <button class="page-button" :disabled="page === searchPage" @click="goPage(page)">
          {{ page }}
        </button>
      </template>
    </div>
  </div>
</template>

<script>
// import api from "@/api"
import { mapGetters } from "vuex"

export default {
  name: "MainView",
  computed: {
    ...mapGetters({
      searchQ: "searchQ",
      searchPage: "searchPage",
      searchResult: "searchResult",
    }),
    pagination() {
      const numPages = Math.ceil(this.searchResult.numPosts / 10)
      if (numPages === 0) {
        return {
          prev: null,
          pages: [],
          next: null,
        }
      }
      const ret = {}
      if (this.searchPage <= 10 || this.searchPage > numPages) {
        ret.prev = null
      } else {
        ret.prev = this.searchPage - 1 - ((this.searchPage - 1) % 10)
      }
      if (this.searchPage > numPages - 1 - ((numPages - 1) % 10)) {
        ret.next = null
      } else if (this.searchPage <= 0) {
        if (numPages > 10) {
          ret.next = 11
        } else {
          ret.next = null
        }
      } else {
        ret.next = this.searchPage + 10 - ((this.searchPage - 1) % 10)
      }
      const left = ret.prev === null ? 1 : ret.prev
      const right = ret.next === null ? numPages : ret.next
      ret.pages = []
      for (let page = left; page <= right; page++) {
        ret.pages.push(page)
      }
      return ret
    },
  },
  methods: {
    // async getImages(postId, clubName) {
    //   console.log("getImages: ", postId, clubName)
    //   let urls = []
    //   let res = null
    //   try {
    //     res = await api.getPostFiles(postId, clubName)
    //     console.log(res)
    //   } catch (err) {
    //     alert(err)
    //     console.log(err)
    //   }
    //   for (const file in res.data) {
    //     const url = URL.createObjectURL(file)
    //     urls.push(url)
    //   }
    //   return urls
    // },
    goPage(page) {
      this.$router.push({
        name: "main",
        query: {
          q: this.searchQ,
          page: String(page),
        },
      })
    },
  },
}
</script>
