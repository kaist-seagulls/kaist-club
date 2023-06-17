<template>
  <div class="t-box t-flex-g1">
    <!-- To the designer: A div below is for debugging. You can remove this. -->
    <div class="t-title">
      MainView
    </div>
    <!-- To the designer: A div below is for debugging. You can remove this. -->
    <div>
      ToFill: Posts
    </div>
    <!-- To the designer: A div below is for debugging. You can remove this. -->
    <div>
      search q: {{ searchQ }} /
      page: {{ searchPage }}
    </div>
    <!-- To the designer: A div below is for debugging. You can remove this. -->
    <div>
      RESULT CLUBS
    </div>
    <!-- To the designer: A div below is for debugging. You can remove this. -->
    <div>
      <div v-for="club in searchResult.clubs" :key="club.clubName" style="border: 1px black solid">
        <div>
          name: {{ club.clubName }}
        </div>
        <div>
          categoryName: {{ club.categoryName }}
        </div>
      </div>
    </div>
    <div>
      RESULT POSTS
    </div>
    <!-- To the designer: A div below is for debugging. You can remove this. -->
    <div>
      <div v-for="post in searchResult.posts" :key="post.postId" style="border: 1px black solid">
        <div>
          clubName: {{ post.clubName }}
        </div>
        <div>
          title: {{ post.title }}
        </div>
        <div v-if="post.isRecruit">
          THIS IS FOR RECRUITMENT
        </div>
        <div v-if="post.isOnly">
          THIS IS ONLY FOR CLUB MEMBERS
        </div>
        <div>
          contents: {{ post.contents }}
        </div>
        <div>
          uploadTime: {{ post.uploadTime }}
        </div>
        <div v-if="post.scheduleStart">
          scheduleStart: {{ post.scheduleStart }}
        </div>
        <div v-if="post.scheduleEnd">
          scheduleEnd: {{ post.scheduleEnd }}
        </div>
      </div>
    </div>
    <!-- To the designer: A div below is for debugging. You can remove this. -->
    <div>
      PAGINATION
    </div>
    <!-- To the designer: A div below is for debugging. You can remove this. -->
    <div>
      <template v-for="page in pagination.pages" :key="page">
        <button :disabled="page === searchPage" @click="goPage(page)">
          {{ page }}
        </button>
      </template>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex"

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
    ...mapActions({
      updateSearchPage: "updateSearchPage",
    }),
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
