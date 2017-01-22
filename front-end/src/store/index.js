import Vue from 'vue'
import Vuex from 'vuex'
import { fetchLinks } from './api'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    // The selected room
    activePage: 'vodori-news',
    itemsPerPage: 10,
    page: 1,
    links: {
        "vodori-news": [],
        "dev-io": [],
        "all-the-people": []
    }
  },

  actions: {
    FETCH_LINKS: ({ state, commit }, { type } ) => {
      if (state.activePage !== type) {
        commit('SET_ACTIVE_PAGE', { type })
      }
      let storedLinks = state.links[type];
      if (storedLinks.length < 1) {
        storedLinks = fetchLinks(type).then(links => commit('SET_LINKS', { links, type }))
      }
      return storedLinks
    },

    CHANGE_PAGINATION: ({ commit }, page) => {
        Promise.resolve(commit('SET_PAGE', page))
    }
  },

  mutations: {
    SET_ACTIVE_PAGE: (state, { type }) => {
      state.activePage = type
    },

    SET_LINKS: (state, { links, type }) => {
      state.links[type] = links
    },

    SET_PAGE: (state, page) => {
      state.page = page;
    }
  },

  getters: {
    links: state => {
      let startIndex = (state.page - 1) * state.itemsPerPage;
      return state.links[state.activePage].slice(startIndex, startIndex + state.itemsPerPage);
    }
  }
})

export default store
