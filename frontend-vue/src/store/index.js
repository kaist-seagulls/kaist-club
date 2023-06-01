import { createStore } from 'vuex'
import axios from 'axios'

const prefix = '/api/v1/'

export default createStore({
  state: {
    relatedClubs: {},
    checked: {},
  },
  getters: {
    filterConfig (state) {
      let config = Object.create()
      config.joined = []
      config.notJoined = []
      for (const [id, club] in Object.entries(state.relatedClubs)) {
        if (club.isJoined) {
          config.joined.push(
            {id, name: club.name, isChecked: state.checked[id]}
          )
        } else {
          config.joined.push(
            {id, name: club.name, isChecked: state.checked[id]}
          )
        }
      }
      return config
    },
  },
  mutations: {
    updateRelatedClubs (state, clubs) {
      for (const club in clubs) {
        let id = club.id
        club.removeAttribute('id')
        state.checked[id] = true
        state.relatedClubs[id] = club
      }
    },
    setChecked (state, id) {
      state.checked[id] = true
    },
    setUnchecked (state, id) {
      state.checked[id] = false
    },
    setAllChecked (state) {
      for (let id in Object.keys(state.checked)) {
        state.checked[id] = true
      }
    },
    setAllUnchecked (state) {
      for (let id in Object.keys(state.checked)) {
        state.checked[id] = false
      }
    },
  },
  actions: {
    async fetchRelatedClubs (context) {
      axios
        .get(prefix + 'get-clubs-related')
        .then(res => {
          context.commit('updateRelatedClubs', res.related)
        })
        .catch(err => {
          alert(err)
        })
    },
    toggleChecked (context, id) {
      if (context.state.checked[id]) {
        context.commit('setUnchecked')
      } else {
        context.commit('setChecked')
      }
    },    
  },
  modules: {
  }
})
