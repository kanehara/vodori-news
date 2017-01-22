import Vue from "vue";
import Router from "vue-router";
import {createListView} from "../views/CreateListView";

Vue.use(Router)

export default new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    { path: '/vodori-news/:page(\\d+)?', component: createListView('vodori-news') },
    { path: '/all-the-people/:page(\\d+)?', component: createListView('all-the-people') },
    { path: '/dev-io/:page(\\d+)?', component: createListView('dev-io') },
    { path: '/', redirect: '/vodori-news' }
  ]
})
