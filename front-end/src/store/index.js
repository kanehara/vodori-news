import Vue from 'vue'
import Vuex from 'vuex'
import { fetchLinks } from './api'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    // The view list type that is active
    activeType: 'new',
    itemsPerPage: 20,
    links: {
        new: []
    }
  },

  actions: {
    FETCH_LINKS: ({ commit }, { type } ) => {
        return fetchLinks(type).then(links => commit('SET_LINKS', { links, type }))
    }
  },

  mutations: {
    SET_LINKS: (state, { links, type }) => {
      state.links[type] = links
    }
  },

  getters: {
    links: state => {
      return state.links[state.activeType];
    }
  }
})

export default store
