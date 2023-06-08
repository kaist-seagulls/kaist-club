import { createStore } from "vuex"
import axios from "axios"

const prefix = "/api/v1/"

export default createStore({
  state: {
    relatedClubs: {},
    checked: {},
    noFilter: false,
    currentClubs: [],
    requestsNewClub: {},
    requestsHandover: {},
    clubProfile: {},
    userInfo: {},
    members: [],
    applicants: [],
    events: {},
    calendar: [],
  },
  getters: {
    // Getters for filter
    filterConfig(state) {
      const config = {}
      config.joined = []
      config.notJoined = []
      for (const [name, club] of Object.entries(state.relatedClubs)) {
        if (club.isJoined) {
          config.joined.push(
            { name, isChecked: state.checked[name] },
          )
        } else {
          config.notJoined.push(
            { name, isChecked: state.checked[name] },
          )
        }
      }
      return config
    },
    isAllJoinedChecked(state) {
      for (const [name, club] of Object.entries(state.relatedClubs)) {
        if (club.isJoined) {
          if (!state.checked[name]) {
            return false
          }
        }
      }
      return true
    },
    isAllNotJoinedChecked(state) {
      for (const [name, club] of Object.entries(state.relatedClubs)) {
        if (!club.isJoined) {
          if (!state.checked[name]) {
            return false
          }
        }
      }
      return true
    },
    isNoFilterChecked(state) {
      return state.noFilter
    },
    // Getters for admin
    currentClubs(state) {
      return state.currentClubs
    },
    requestsNewClub(state) {
      return state.requestsNewClub
    },
    requestsHandover(state) {
      return state.requestsHandover
    },
    // Getters for clubprofile
    clubProfile(state) {
      return state.clubProfile
    },
    // Getters for userInfo
    userInfo(state) {
      return state.userInfo
    },
    // Getters for calendar
    events(state) {
      return state.events
    },
    calendar(state) {
      return state.calendar
    },
  },
  mutations: {
    // Mutations for filter
    updateRelatedClubs(state, clubs) {
      const relatedClubs = {}
      const checked = {}
      for (const club of clubs) {
        relatedClubs[club.name] = {
          isJoined: club.isJoined,
        }
        if (state.checked[club.name] === undefined) {
          checked[club.name] = true
        } else {
          checked[club.name] = state.checked[club.name]
        }
      }
      state.relatedClubs = relatedClubs
      state.checked = checked
    },
    setChecked(state, name) {
      state.checked[name] = true
    },
    setUnchecked(state, name) {
      state.checked[name] = false
    },
    setAllJoinedChecked(state) {
      for (const [name, club] of Object.entries(state.relatedClubs)) {
        if (club.isJoined) {
          state.checked[name] = true
        }
      }
    },
    setAllJoinedUnchecked(state) {
      for (const [name, club] of Object.entries(state.relatedClubs)) {
        if (club.isJoined) {
          state.checked[name] = false
        }
      }
    },
    setAllNotJoinedChecked(state) {
      for (const [name, club] of Object.entries(state.relatedClubs)) {
        if (!club.isJoined) {
          state.checked[name] = true
        }
      }
    },
    setAllNotJoinedUnchecked(state) {
      for (const [name, club] of Object.entries(state.relatedClubs)) {
        if (!club.isJoined) {
          state.checked[name] = false
        }
      }
    },
    setAllChecked(state) {
      for (const name in state.checked) {
        state.checked[name] = true
      }
    },
    setAllUnchecked(state) {
      for (const name in state.checked) {
        state.checked[name] = false
      }
    },
    //Mutations for admin
    updateAdminInfo(state, adminInfo) {
      state.currentClubs = adminInfo.clubs
      state.requestsNewClub = {}
      state.requestsHandover = {}
      for (const request of adminInfo.requestsNewClub) {
        state.requestsNewClub[request.requestNewClubId] = {
          categoryName: request.categoryName,
          clubName: request.clubName,
          clubDescription: request.clubDescription,
          requestUser: request.requestUser,
        }
      }
      for (const request of adminInfo.requestsHandover) {
        state.requestsHandover[request.requestsHandoverId] = {
          clubName: request.clubName,
          fromUserName: request.fromUserName,
          toUserName: request.toUserName,
        }
      }
    },
    setNoFilterUnchecked(state) {
      state.noFilter = false
    },
    setNoFilterChecked(state) {
      state.noFilter = true
    },
    // Mutations for admin
    eraseClub(state, name) {
      state.currentClubs.removeAttribute(name)
    },
    eraseRequestNewClub(state, name) {
      state.requestsNewClub.removeAttribute(name)
    },
    eraseRequestHandover(state, name) {
      state.requestsHandover.removeAttribute(name)
    },
    // Mutations for clubprofile
    updateClubProfile(state, profile) {
      state.clubProfile = profile
    },
    // Mutations for userInfo
    updateUserInfo(state, userInfo) {
      state.userInfo = userInfo
    },
    // Mutations for representing
    updateMembers(state, members) {
      state.members = members
    },
    updateApplicants(state, applicants) {
      state.applicants = applicants
    },
    eraseMember(state, userid) {
      let index = state.members.indexOf(userid)
      if (index < 0) {
        alert(`Cannot erase [${userid}] from the member list`)
      } else {
        state.members.splice(index, 1)
      }
    },
    eraseApplicant(state, userid) {
      let index = state.applicants.indexOf(userid)
      if (index < 0) {
        alert(`Cannot erase [${userid}] from the applicants list`)
      } else {
        state.applicants.splice(index, 1)
      }
    },
    // Mutations for calendar
    updateCalendar(state, payload) {
      let events = payload.events
      let month = payload.month
      let year = payload.year
      
      state.events = events
      state.calendar = []

      const firstDayofMonth = new Date(year, month).getDay()
      const lastDateofMonth = new Date(year, month + 1, 0).getDate()
      const lastDayofMonth = new Date(year, month, lastDateofMonth).getDay()
      const lastDateofLastMonth = new Date(year, month, 0).getDate()
      let prevYear, prevMonth, nextYear, nextMonth
      if (month > 0) {
        prevMonth = month-1
        prevYear = year
      } else {
        prevMonth = 11
        prevYear = year-1
      }
      if (month<11) {
        nextMonth = month+1
        nextYear = year
      } else {
        nextMonth = 0
        nextYear = year+1
      }

      for (let i=firstDayofMonth; i>0; i--) {
        state.calendar.push({
          number: lastDateofLastMonth - i + 1,
          date: new Date(prevYear, prevMonth, lastDateofLastMonth-i+1),
          events: {},
        })
      }
      for (let i=1; i<=lastDateofMonth; i++) {
        state.calendar.push({
          number: i,
          date: new Date(year, month, i),
          events: {},
        })
      }
      for (let i=lastDayofMonth; i<=6; i++) {
        state.calendar.push({
          number: i - lastDayofMonth + 1,
          date: new Date(nextYear, nextMonth, i - lastDayofMonth + 1),
          events: {},
        })
      }
      
      console.log("update calendar completed")
    },
    applyEvents(state) {
      let eventIndex = 0
      for (const i in state.events) {
        for (const key in state.calendar) {
          if (isIncluded(state.calendar[key], state.events[i]) && state.checked[state.events[i].clubId]) {
            state.calendar[key].events[eventIndex] = state.events[i]
          }
        }
        eventIndex++
      }
      function isIncluded(day, e) {
        const date = day.date
        const startDate = e.startDate
        const endDate = e.endDate
        if (startDate <= date && date <= endDate) return true
        return false
      }
    },
  },
  actions: {
    // Actions for filter
    async fetchRelatedClubs(context) {
      axios
        .get(prefix + "get-clubs-related")
        .then(res => {
          context.commit("updateRelatedClubs", res.data)
        })
        .catch(err => {
          console.log(err)
          alert(err)
        })
    },
    toggleChecked(context, id) {
      if (context.state.checked[id]) {
        context.commit("setUnchecked", id)
      } else {
        context.commit("setChecked", id)
      }
    },
    toggleJoinedChecked(context) {
      if (context.getters.isAllJoinedChecked) {
        context.commit("setAllJoinedUnchecked")
      } else {
        context.commit("setAllJoinedChecked")
      }
    },
    toggleNotJoinedChecked(context) {
      if (context.getters.isAllNotJoinedChecked) {
        context.commit("setAllNotJoinedUnchecked")
      } else {
        context.commit("setAllNotJoinedChecked")
      }
    },
    toggleAllChecked(context) {
      if (context.getters.isAllChecked) {
        context.commit("setAllUnchecked")
      } else {
        context.commit("setAllChecked")
      }
    },
    toggleNoFilter(context) {
      if (context.getters.isNoFilterChecked) {
        context.commit("setNoFilterUnchecked")
      } else {
        context.commit("setNoFilterChecked")
      }
    },
    // Actions for clubprofile
    fetchClubProfile(context, id) {
      let apiAddress = prefix + "getdata/assets/logos" + id
      axios
        .get(apiAddress) // example api address
        .then((res) => {
          context.commit("updateClubInfo", res.data)
        })
        .catch((err) => {
          alert(err)
          console.log(err)
        })
    },
    // Actions for representing
    fetchUserInfo(context) {
      axios
        .get(prefix + "get-user-info")
        .then((res) => {
          context.commit("updateUserInfo", res.data)
        })
        .catch((err) => {
          alert(err)
          console.log(err)
        })
    },
    async acceptJoin(context, id) {
      let userInfo = context.state.userInfo
      axios
        .post(prefix + "accept-join/" + userInfo.representing, id)
        .then(() => {
          context.commit("eraseApplicant", id)
        })
        .catch((err) => {
          alert(err)
          console(err)
        })
    },
    async denyJoin(context, id) {
      let userInfo = context.state.userInfo
      axios
        .post(prefix + "deny-join/" + userInfo.representing, id)
        .then(() => {
          context.commit("eraseApplicant", id)
        })
        .catch((err) => {
          alert(err)
          console(err)
        })
    },
    async getOuttaMyClubDude(context, id) {
      let userInfo = context.state.userInfo
      axios
        .post(prefix + "get-outta-my-club-dude/" + userInfo.representing, id)
        .then(() => {
          context.commit("eraseMember", id)
        })
        .catch((err) => {
          alert(err)
          console(err)
        })
    },
    async requestHandover(context, id) {
      let userInfo = context.state.userInfo
      axios
        .post(prefix + "request-handover/" + userInfo.representing, id)
        .then(() => {
          alert(`Handover request completed: ${userInfo.userId} -> ${id}`)
        })
        .catch((err) => {
          alert(err)
          console(err)
        })
    },
    // Actions for admin
    async fetchAdminInfo(context) {
      axios
        .get(prefix + "get-admin-info")
        .then(res => {
          context.commit("updateAdminInfo", res.data)
        })
        .catch(err => {
          alert(err)
          console.log(err)
        })
    },
    async deleteClub(context, name) {
      axios
        .post("delete-club", {
          name,
        })
        .then(() => {
          context.commit("eraseRequestNewClub", name)
        })
        .catch(err => {
          alert(err)
          console.log(err)
        })
    },
    async acceptNewClub(context, newClubId) {
      axios
        .post("request-newclub", {
          newclubRequestId: newClubId,
        })
        .then(() => {
          context.commit("eraseRequestNewClub", newClubId)
        })
        .catch(err => {
          alert(err)
          console.log(err)
        })
    },
    async denyNewClub(context, newClubId) {
      axios
        .post("deny-newclub", {
          newclubRequestId: newClubId,
        })
        .then(() => {
          context.commit("eraseRequestNewClub", newClubId)
        })
        .catch(err => {
          alert(err)
          console.log(err)
        })
    },
    async acceptHandover(context, handoverId) {
      axios
        .post("accept-handover", {
          handoverId,
        })
        .then(() => {
          context.commit("eraseRequestHandover", handoverId)
        })
        .catch(err => {
          alert(err)
          console.log(err)
        })
    },
    async denyHandover(context, handoverId) {
      axios
        .post("deny-handover", {
          handoverId,
        })
        .then(() => {
          context.commit("eraseRequestHandover", handoverId)
        })
        .catch(err => {
          alert(err)
          console.log(err)
        })
    },
    // Actions for calendar
    async fetchCalendar(context, payload) {
      let month = payload.month
      let year = payload.year
      axios
        .get(prefix + "get-schedule", {
          year,
          month,
        })
        .then((res) => {
          try{
            context.commit("updateCalender", res.data, month, year)
          } finally {
            context.commit("applyEvents")
          }
        })
        .catch(err => {
          alert(err)
          console.log(err)
        })
    },
    async applyEvents(context) {
      context.commit("applyEvents")
    },
  },
  modules: {
  },
})
