import { createStore } from "vuex"
import api from "@/api"

const getIntervalOfCalendar = (year, month, firstDayOfWeek) => {
  const startDayOfMonth = (new Date(Date.UTC(year, month - 1))).getUTCDay()
  const startRelDayOfMonth = (startDayOfMonth + 7 - firstDayOfWeek) % 7
  const start = new Date(Date.UTC(year, month - 1, 1 - startRelDayOfMonth))
  const endDayOfMonth = (new Date(Date.UTC(year, month, 0))).getUTCDay()
  const endRelDayOfMonth = (endDayOfMonth + 7 - firstDayOfWeek) % 7
  const end = new Date(Date.UTC(year, month, 6 - endRelDayOfMonth))
  return [start, end]
}

export default createStore({
  state: {
    inputQ: "",
    searchQ: "",
    searchPage: 1,
    searchResult: {
      numPosts: 0,
      clubs: [],
      posts: [],
    },
    relatedClubs: {
      joined: [],
      subscribed: [],
    },
    checked: {},
    noFilter: false,
    currentClubs: [],
    requestsNewClub: {},
    requestsHandover: {},
    clubProfile: {},
    userInfo: {},
    members: [],
    applicants: [],
    events: [],
    boundaryDates: null,
  },
  getters: {
    // Getters for filter
    inputQ(state) {
      return state.inputQ
    },
    searchQ(state) {
      return state.searchQ
    },
    searchPage(state) {
      return state.searchPage
    },
    searchResult(state) {
      return state.searchResult
    },
    searchFilter(state) {
      if (state.noFilter) {
        return []
      }
      const filter = []
      for (const club in state.checked) {
        if (state.checked[club]) {
          filter.push(club)
        }
      }
      return filter
    },
    filterConfig(state) {
      const config = {
        joined: [],
        notJoined: [],
      }
      for (const club of state.relatedClubs.joined) {
        config.joined.push({
          name: club,
          isChecked: state.checked[club],
        })
      }
      for (const club of state.relatedClubs.subscribed) {
        config.notJoined.push({
          name: club,
          isChecked: state.checked[club],
        })
      }
      return config
    },
    isAllJoinedChecked(state) {
      for (const club of state.relatedClubs.joined) {
        if (!state.checked[club]) {
          return false
        }
      }
      return true
    },
    isAllNotJoinedChecked(state) {
      for (const club of state.relatedClubs.subscribed) {
        if (!state.checked[club]) {
          return false
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
    calendarRepresentation(state) {
      if (state.boundaryDates === null) {
        return null
      }
      const start = state.boundaryDates.start
      const end = state.boundaryDates.end

      const idxMap = {}
      const weeks = []
      let week = undefined
      let day = 0
      let weekNumber = 0
      for (
        let date = new Date(start);
        date <= end;
        date.setUTCDate(date.getUTCDate() + 1)
      ) {
        if (day === 0) {
          week = {
            weekNumber,
            days: [],
            weekEventStackOffset: undefined,
            weekEventStackSize: undefined,
          }
        }
        const uY = date.getUTCFullYear()
        const uM = date.getUTCMonth() + 1
        const uDt = date.getUTCDate()
        const uDy = date.getUTCDay()
        if (!idxMap[uY]) {
          idxMap[uY] = {}
        }
        if (!idxMap[uY][uM]) {
          idxMap[uY][uM] = {}
        }
        idxMap[uY][uM][uDt] = [weekNumber, day]
        const d = {
          year: uY,
          month: uM,
          date: uDt,
          day: uDy,
          fullDate: new Date(date),
          events: [],
        }
        week.days.push(d)
        if (day === 6) {
          weeks.push(week)
          weekNumber += 1
          day = 0
        } else {
          day += 1
        }
      }

      const truncStart = (eventStart) => {
        if (eventStart < start) {
          return start
        } else {
          return eventStart
        }
      }
      const truncEnd = (eventEnd) => {
        if (eventEnd > end) {
          return end
        } else {
          return eventEnd
        }
      }

      let eventStackSize = 0
      let checkedEvents = state.events.filter((event) => {
        return state.checked[event.clubName] && event.start < end && event.end > start
      })
      if (checkedEvents.length > 0) {
        checkedEvents.sort((a, b) => {
          if (a.start < b.start) {
            return -1
          } else {
            return 1
          }
        })
        while (checkedEvents.length > 0) {
          const remainingEvents = []
          let cursor = start
          for (const i in checkedEvents) {
            const event = checkedEvents[i]
            const tStart = truncStart(event.start)
            const tEnd = truncEnd(event.end)
            if (tStart < cursor) {
              remainingEvents.push(event)
              continue
            }
            let date = new Date(tStart)
            for (
              ;
              date <= tEnd;
              date.setUTCDate(date.getUTCDate() + 1)
            ) {
              const idx = idxMap[date.getUTCFullYear()][date.getUTCMonth() + 1][date.getUTCDate()]
              const weekNumber = idx[0]
              const dayNumber = idx[1]
              weeks[weekNumber].days[dayNumber].events[eventStackSize] = event
            }
            cursor = date
          }
          checkedEvents = remainingEvents
          eventStackSize += 1
        }
      }
      for (const week of weeks) {
        let eimin = undefined
        for (let ei = 0; ei < eventStackSize; ei += 1) {
          for (const day of week.days) {
            if (day.events[ei] !== undefined) {
              eimin = ei
              break
            }
          }
          if (eimin !== undefined) {
            break
          }
        }
        if (eimin !== undefined) {
          week.weekEventStackOffset = eimin
          let eimax = undefined
          for (let ei = eventStackSize - 1; ei >= 0; ei -= 1) {
            for (const day of week.days) {
              if (day.events[ei] !== undefined) {
                eimax = ei
                break
              }
            }
            if (eimax !== undefined) {
              break
            }
          }
          week.weekEventStackSize = eimax - eimin + 1
        }
      }
      return {
        eventStackSize,
        weeks,
      }
    },
    // Getters for representing
    members(state) {
      return state.members
    },
    applicants(state) {
      return state.applicants
    },
  },
  mutations: {
    // Mutations for filter
    updateInputQ(state, q) {
      state.inputQ = q
    },
    updateSearchQ(state, q) {
      state.searchQ = q
    },
    updateSearchPage(state, page) {
      state.searchPage = page
    },
    updateSearchResult(state, searchResult) {
      state.searchResult = searchResult
    },
    updateRelatedClubs(state, relatedClubs) {
      const clubs = relatedClubs.joined.concat(relatedClubs.subscribed)
      const checked = {}
      for (const club of clubs) {
        if (state.checked[club] === undefined) {
          checked[club] = true
        } else {
          checked[club] = state.checked[club]
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
      for (const club of state.relatedClubs.joined) {
        state.checked[club] = true
      }
    },
    setAllJoinedUnchecked(state) {
      for (const club of state.relatedClubs.joined) {
        state.checked[club] = false
      }
    },
    setAllNotJoinedChecked(state) {
      for (const club of state.relatedClubs.subscribed) {
        state.checked[club] = true
      }
    },
    setAllNotJoinedUnchecked(state) {
      for (const club of state.relatedClubs.subscribed) {
        state.checked[club] = false
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
      state.currentClubs = adminInfo.currentClubs
      state.requestsNewClub = {}
      state.requestsHandover = {}
      for (const request of adminInfo.requestsNewClub) {
        state.requestsNewClub[request.requestNewClubId] = {
          categoryName: request.categoryName,
          clubName: request.clubName,
          descriptions: request.descriptions,
          userId: request.userId,
        }
      }
      for (const request of adminInfo.requestsHandover) {
        console.log(request.fromId)
        state.requestsHandover[request.requestsHandoverId] = {
          clubName: request.clubName,
          fromId: request.fromId,
          toId: request.toId,
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
    updateEvents(state, payload) {
      for (const event of payload) {
        event.start = new Date(event.start)
        event.end = new Date(event.end)
      }
      state.events = payload
    },
    updateBoundaryDates(state, payload) {
      state.boundaryDates = payload
    },
  },
  actions: {
    // Actions for filter
    updateInputQ(context, q) {
      context.commit("updateInputQ", q)
    },
    updateSearchQ(context, q) {
      context.commit("updateSearchQ", q)
    },
    updateSearchPage(context, page) {
      context.commit("updateSearchPage", page)
    },
    async fetchRelatedClubs(context) {
      console.log("fetchRelatedClubs")
      api.fetchRelatedClubs()
      console.log(context.state.relatedClubs)
    },
    toggleChecked(context, name) {
      if (context.state.checked[name]) {
        context.commit("setUnchecked", name)
      } else {
        context.commit("setChecked", name)
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
    toggleNoFilter(context) {
      if (context.getters.isNoFilterChecked) {
        context.commit("setNoFilterUnchecked")
      } else {
        context.commit("setNoFilterChecked")
        context.commit("setAllJoinedChecked")
        context.commit("setAllNotJoinedChecked")
      }
    },
    // Actions for clubprofile
    // fetchClubProfile(context, id) {
    //   let apiAddress = prefix + "getdata/assets/logos" + id
    //   axios
    //     .get(apiAddress) // example api address
    //     .then((res) => {
    //       context.commit("updateClubInfo", res.data)
    //     })
    //     .catch((err) => {
    //       alert(err)
    //       console.log(err)
    //     })
    // },
    async acceptJoin(context, id) {
      let userInfo = context.state.userInfo
      try {
        await api.acceptJoin(userInfo.representing, id)
        context.commit("eraseApplicant", id)
      } catch (err) {
        alert(err)
        console.log(err)
      }
    },
    async denyJoin(context, id) {
      let userInfo = context.state.userInfo
      try {
        await api.denyJoin(userInfo.representing, id)
        context.commit("eraseApplicant", id)
      } catch (err) {
        alert(err)
        console.log(err)
      }
    },
    async getOuttaMyClubDude(context, id) {
      let userInfo = context.state.userInfo
      try {
        await api.getOuttaMyClubDude(userInfo.representing, id)
        context.commit("eraseApplicant", id)
      } catch (err) {
        alert(err)
        console.log(err)
      }
    },
    // Actions for admin
    async fetchAdminInfo(context) {
      try {
        let res = await api.getAdminInfo()
        console.log(res)
        context.commit("updateAdminInfo", res.data)
      } catch (err) {
        alert(err)
        console.log(err)
      }
    },
    async deleteClub(context, name) {
      try {
        await api.deleteClub(name)
        context.commit("eraseClub", name)
      } catch (err) {
        alert(err)
        console.log(err)
      }
    },
    async acceptNewclub(context, newClubId) {
      try {
        await api.acceptNewclub(newClubId)
        context.commit("eraseRequestNewClub", newClubId)
      } catch (err) {
        alert(err)
        console.log(err)
      }
    },
    async denyNewclub(context, newClubId) {
      try {
        await api.denyNewclub(newClubId)
        context.commit("eraseRequestNewClub", newClubId)
      } catch (err) {
        alert(err)
        console.log(err)
      }
    },
    async acceptHandover(context, handoverId) {
      try {
        await api.acceptHandover(handoverId)
        context.commit("eraseRequestHandover", handoverId)
      } catch (err) {
        alert(err)
        console.log(err)
      }
    },
    async denyHandover(context, handoverId) {
      try {
        await api.denyHandover(handoverId)
        context.commit("eraseRequestHandover", handoverId)
      } catch (err) {
        alert(err)
        console.log(err)
      }
    },
    async fetchData(context, payload) {
      const to = payload.to
      const viewName = payload.to.name
      // let requiredAuthority = null
      // if (["admin"].includes(viewName)) {
      //   requiredAuthority = "a"  // Signed in + Administrator
      // } else if (
      //   [
      //     "newpost",
      //     "editclub",
      //     "manageclub",
      //   ].includes(viewName)
      // ) {
      //   requiredAuthority = "r"  // Signed in + Representative
      // } else if (
      //   [
      //     "calendar",
      //     "changepassword",
      //     "club",
      //     "newclub",
      //     "main",
      //     "mypage",
      //   ].includes(viewName)
      // ) {
      //   requiredAuthority = "i"  // Signed in
      // } else if (
      //   [
      //     "forgotpassword",
      //     "signin",
      //     "signup",
      //   ].includes(viewName)
      // ) {
      //   requiredAuthority = "n"  // Not signed in
      // } else {
      //   return  // Doesn't matter
      // }
      // // console.log(requiredAuthority)

      if (viewName === "calendar") {
        const month = Number(to.params.month)
        const year = Number(to.params.year)
        const firstDayOfWeek = payload.firstDayOfWeek ? payload.firstDayOfWeek : 0
        const [start, end] = getIntervalOfCalendar(year, month, firstDayOfWeek)
        try {
          const res = await api.retrieve({
            requiredAuthority: "i",
            relatedClubs: true,
            events: {
              start,
              end,
            },
          })
          context.commit("updateBoundaryDates", { start, end })
          context.commit("updateRelatedClubs", res.data.relatedClubs)
          context.commit("updateEvents", res.data.events)
        } catch (e) {
          alert(e.response.status)
          throw e
        }
      } else if (viewName === "club") {
        try {
          const res = await api.retrieve({
            requiredAuthority: "i",
            relatedClubs: true,
            clubProfile: to.params.clubName,
          })
          context.commit("updateRelatedClubs", res.data.relatedClubs)
          if (!res.data.clubProfile) {
            throw 404
          }
          context.commit("updateClubProfile", res.data.clubProfile)
        } catch (e) {
          if (e !== 404) {
            alert(e.response.status)
          }
          throw e
        }
      }
      else if (viewName === "main") {
        console.log("fetchData main")
        const options = {
          requiredAuthority: "i",
          relatedClubs: true,
          search: {
            q: context.getters.searchQ,
            filter: context.getters.searchFilter,
            page: context.getters.searchPage,
          },
        }
        const res = await api.retrieve(options)
        context.commit("updateRelatedClubs", res.data.relatedClubs)
        context.commit("updateSearchResult", res.data.search)
        const userInfo = {
          userId: res.data.userId,
          representingClub: res.data.representingClub,
          isAdmin: res.data.isAdmin,
          phone: res.data.phone,
        }
        context.commit("updateUserInfo", userInfo)
      }
      else if (viewName === "newpost") {
        const options = {
          requiredAuthority: "i",
        }
        const res = await api.retrieve(options)
        const userInfo = {
          userId: res.data.userId,
          representingClub: res.data.representingClub,
          isAdmin: res.data.isAdmin,
          phone: res.data.phone,
        }
        context.commit("updateUserInfo", userInfo)
      }
      else if (viewName === "newpost") {
        const options = {
          requiredAuthority: "r",
        }
        const res = await api.retrieve(options)
        console.log("res", res)
        const userInfo = {
          userId: res.data.userId,
          representingClub: res.data.representingClub,
          isAdmin: res.data.isAdmin,
        }
        context.commit("updateUserInfo", userInfo)
      }
    },
    async requestHandover(context, id) {
      let userInfo = context.state.userInfo
      try {
        await api.requestHandover(userInfo.representing, id)
        alert(`Handover request completed: ${userInfo.userId} -> ${id}`)
      } catch (err) {
        alert(err)
        console.log(err)
      }
    },
  },
  modules: {
  },
})
