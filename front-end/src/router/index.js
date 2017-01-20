import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import { createListView } from '../views/CreateListView'
import ItemView from '../views/ItemView.vue'
import UserView from '../views/UserView.vue'

export default new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    { path: '/vodori-news/:page(\\d+)?', component: createListView('vodori-news') },
    { path: '/vodori-news', redirect: '/vodori-news/1'},
    { path: '/all-the-people/:page(\\d+)?', component: createListView('all-the-people') },
    { path: '/all-the-people', redirect: '/all-the-people/1'},
    { path: '/dev-io/:page(\\d+)?', component: createListView('dev-io') },
    { path: '/dev-io', redirect: '/dev-io/1'},
    { path: '/', redirect: '/vodori-news/1' }
  ]
})
