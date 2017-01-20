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
    FETCH_LINKS: ({ commit }, { type } ) => {
        return fetchLinks(type).then(links => commit('SET_LINKS', { links, type }))
    },

    CHANGE_PAGE: ({ commit }, page) => {
        Promise.resolve(commit('SET_PAGE', page))
    }
  },

  mutations: {
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
      return state.links['vodori-news'].slice(startIndex, startIndex + state.itemsPerPage);
    }
  }
})

export default store
