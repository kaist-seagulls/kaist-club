import { createStore } from "vuex"
import axios from "axios"

const prefix = "/api/v1/"

export default createStore({
  state: {
    relatedClubs: {},
    checked: {},
    currentClubs: {},
    requestsNewClub: {},
    requestsHandover: {},
    events: {},
    calendar: [],
  },
  getters: {
    filterConfig(state) {
      const config = {}
      config.joined = []
      config.notJoined = []
      for (const [id, club] of Object.entries(state.relatedClubs)) {
        if (club.isJoined) {
          config.joined.push(
            { id, name: club.name, isChecked: state.checked[id] },
          )
        } else {
          config.notJoined.push(
            { id, name: club.name, isChecked: state.checked[id] },
          )
        }
      }
      return config
    },
    isAllJoinedChecked(state) {
      for (const [id, club] of Object.entries(state.relatedClubs)) {
        if (club.isJoined) {
          if (!state.checked[id]) {
            return false
          }
        }
      }
      return true
    },
    isAllNotJoinedChecked(state) {
      for (const [id, club] of Object.entries(state.relatedClubs)) {
        if (!club.isJoined) {
          if (!state.checked[id]) {
            return false
          }
        }
      }
      return true
    },
    isNoFilterChecked(state) {
      return state.noFilter
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
    updateRelatedClubs(state, clubs) {
      const relatedClubs = {}
      const checked = {}
      for (const club of clubs) {
        relatedClubs[club.id] = {
          name: club.name,
          isJoined: club.isJoined,
        }
        if (state.checked[club.id] === undefined) {
          checked[club.id] = true
        } else {
          checked[club.id] = state.checked[club.id]
        }
      }
      state.relatedClubs = relatedClubs
      state.checked = checked
    },
    setChecked(state, id) {
      state.checked[id] = true
    },
    setUnchecked(state, id) {
      state.checked[id] = false
    },
    setAllJoinedChecked(state) {
      for (const [id, club] of Object.entries(state.relatedClubs)) {
        if (club.isJoined) {
          state.checked[id] = true
        }
      }
    },
    setAllJoinedUnchecked(state) {
      for (const [id, club] of Object.entries(state.relatedClubs)) {
        if (club.isJoined) {
          state.checked[id] = false
        }
      }
    },
    setAllNotJoinedChecked(state) {
      for (const [id, club] of Object.entries(state.relatedClubs)) {
        if (!club.isJoined) {
          state.checked[id] = true
        }
      }
    },
    setAllNotJoinedUnchecked(state) {
      for (const [id, club] of Object.entries(state.relatedClubs)) {
        if (!club.isJoined) {
          state.checked[id] = false
        }
      }
    },
    setAllChecked(state) {
      for (const id in state.checked) {
        state.checked[id] = true
      }
    },
    setAllUnchecked(state) {
      for (const id in state.checked) {
        state.checked[id] = false
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
        context.commit("setNoFilterUnchecked")
      } else {
        context.commit("setChecked", id)
      }
    },
    toggleJoinedChecked(context) {
      if (context.getters.isAllJoinedChecked) {
        context.commit("setAllJoinedUnchecked")
        context.commit("setNoFilterUnchecked")
      } else {
        context.commit("setAllJoinedChecked")
      }
    },
    toggleNotJoinedChecked(context) {
      if (context.getters.isAllNotJoinedChecked) {
        context.commit("setAllNotJoinedUnchecked")
        context.commit("setNoFilterUnchecked")
      } else {
        context.commit("setAllNotJoinedChecked")
      }
    },
    toggleNoFilter(context) {
      context.commit("toggleNoFilter")
    },
    // Actions for calendar
    async fetchCalendar(context, payload) {
      let month = payload.month
      let year = payload.year
      //       axios
      //         .get(prefix + "get-schedule", {
      //           year,
      //           month,
      //         })
      //         .then((res) => {
      //           context.commit("updateCalender", res.data, month, year)
      //         })
      //         .catch(err => {
      //           alert(err)
      //           console.log(err)
      //         })
      try {
        context.commit("updateCalendar", {events: [], month: month, year: year})
      } finally {
        context.commit("applyEvents")
      }
    },
    async applyEvents(context) {
      context.commit("applyEvents")
    },
  },
  modules: {
  },
})
