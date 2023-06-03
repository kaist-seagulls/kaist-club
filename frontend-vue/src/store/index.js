import { createStore } from 'vuex'
import axios from 'axios'

const prefix = '/api/v1/'

export default createStore({
  state: {
    relatedClubs: {},
    checked: {},
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
    isAllChecked(state) {
      for (const checked of Object.values(state.checked)) {
        if (!checked) {
          return false
        }
      }
      return true
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
  },
  actions: {
    async fetchRelatedClubs(context) {
      axios
        .get(prefix + 'get-clubs-related')
        .then(res => {
          context.commit('updateRelatedClubs', res.data)
        })
        .catch(err => {
          console.log(err)
          alert(err)
        })
    },
    toggleChecked(context, id) {
      if (context.state.checked[id]) {
        context.commit('setUnchecked', id)
      } else {
        context.commit('setChecked', id)
      }
    },
    toggleJoinedChecked(context) {
      if (context.getters.isAllJoinedChecked) {
        context.commit('setAllJoinedUnchecked')
      } else {
        context.commit('setAllJoinedChecked')
      }
    },
    toggleNotJoinedChecked(context) {
      if (context.getters.isAllNotJoinedChecked) {
        context.commit('setAllNotJoinedUnchecked')
      } else {
        context.commit('setAllNotJoinedChecked')
      }
    },
    toggleAllChecked(context) {
      if (context.getters.isAllChecked) {
        context.commit('setAllUnchecked')
      } else {
        context.commit('setAllChecked')
      }
    },
  },
  modules: {
  },
})
