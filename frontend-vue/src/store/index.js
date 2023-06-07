import { createStore } from "vuex"
import axios from "axios"
import qs from "qs"

axios.defaults.paramsSerializer = params => {
  return qs.stringify(params)
}

const prefix = "/api/v1/"

export default createStore({
  state: {
    relatedClubs: {
      joined: [],
      subscribed: [],
    },
    checked: {},
    noFilter: false,
    currentClubs: {},
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
    updateRelatedClubs(state, relatedClubs) {
      console.log("UPDATE_RELATED_CLUBS")
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
      state.currentClubs = {}
      state.requestsNewClub = {}
      state.requestsHandover = {}
      for (const club of adminInfo.currentClubs) {
        state.currentClubs[club.clubId] = club.clubName
      }
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
        context.commit("setAllJoinedChecked")
        context.commit("setAllNotJoinedChecked")
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
      let firstDayOfWeek = payload.firstDayOfWeek
      if (firstDayOfWeek === undefined) {
        firstDayOfWeek = 0
      }
      const startDayOfMonth = (new Date(Date.UTC(year, month - 1))).getUTCDay()
      const startRelDayOfMonth = (startDayOfMonth + 7 - firstDayOfWeek) % 7
      const start = new Date(Date.UTC(year, month - 1, 1 - startRelDayOfMonth))
      const endDayOfMonth = (new Date(Date.UTC(year, month, 0))).getUTCDay()
      const endRelDayOfMonth = (endDayOfMonth + 7 - firstDayOfWeek) % 7
      const end = new Date(Date.UTC(year, month, 6 - endRelDayOfMonth))
      context.commit("updateBoundaryDates", {
        start,
        end,
      })
      axios
        .get(prefix + "retrieve", {
          params: {
            relatedClubs: true,
            events: {
              start,
              end,
            },
          },
        })
        .then((res) => {
          context.commit("updateRelatedClubs", res.data.relatedClubs)
          context.commit("updateEvents", res.data.events)
        })
        .catch(err => {
          alert(err)
          console.log(err)
        })
    },
    // Actions for userInfo
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
    // Actions for representing
    fetchClubManagementInfo(context) {
      if (context.state.userInfo.authority != "representative" ) return
      axios
        .get(prefix + "get-representing-club")
        .then((res) => {
          axios
            .get(prefix + "get-club-management-info", res.data)
            .then((res) => {
              context.commit("updateMembers", res.data.members)
              context.commit("updateApplicants", res.data.applicants)
            })
        })
        .catch((err) => {
          alert(err)
          console.log(err)
        })
    },
  },
  modules: {
  },
})
