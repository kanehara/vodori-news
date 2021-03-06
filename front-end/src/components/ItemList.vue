<template>
  <div class="news-view">
    <spinner :show="loading"></spinner>
    <news-list-nav :page="page" :maxPage="maxPage" :type="type" v-if="displayedPage > 0"></news-list-nav>
    <transition :name="transition">
      <div class="news-list" :key="displayedPage" v-if="displayedPage > 0">
        <transition-group tag="ul" name="item">
          <item v-for="item in displayedItems" :key="item.timestamp" :item="item">
          </item>
        </transition-group>
      </div>
    </transition>
    <news-list-nav :page="page" :maxPage="maxPage" :type="type" v-if="displayedPage > 0"></news-list-nav>
  </div>
</template>

<script>
import Spinner from './Spinner.vue'
import NewsListNav from './NewsListNav.vue'
import Item from './Item.vue'

let isInitialRender = true

export default {
  name: 'item-list',

  components: {
    Spinner,
    NewsListNav,
    Item
  },

  props: {
    type: String
  },

  data () {
    const data = {
      loading: false,
      transition: 'slide-up',
      // if this is the initial render, directly render with the store state
      // otherwise this is a page switch, start with blank and wait for data load.
      // we need these local state so that we can precisely control the timing
      // of the transitions.
      displayedPage: isInitialRender ? Number(this.$store.state.route.params.page) || 1 : -1,
      displayedItems: isInitialRender ? this.$store.getters.links : []
    }
    isInitialRender = false;
    return data
  },

  computed: {
    page () {
      return Number(this.$store.state.route.params.page) || 1
    },
    maxPage () {
      const { itemsPerPage, links } = this.$store.state
      return Math.ceil(links[this.type].length / itemsPerPage)
    }
  },

  beforeMount () {
    if (this.$root._isMounted) {
      this.loadItems(this.page)
    }
  },

  watch: {
    page (to, from) {
      this.loadItems(to, from)
    }
  },

  methods: {
    loadItems (to = this.page, from = -1) {
      this.loading = true

      this.$store.dispatch("FETCH_LINKS", { type: this.type }).then(() => {
          if (this.page < 0 || this.page > this.maxPage) {
              this.$router.replace(`/${this.type}/1`)
              return
          }
          this.transition = from === -1
              ? null
              : to > from ? 'slide-left' : 'slide-right'
          this.$store.commit('SET_PAGE', to)
          this.displayedPage = to
          this.displayedItems = this.$store.getters.links
          this.loading = false
      })
    }
  }
}
</script>

<style lang="stylus">
.news-list
  width 100%
  max-width 800px
  margin 30px auto
  transition all .5s cubic-bezier(.55,0,.1,1)
  ul
    list-style-type none
    padding 0
    margin 0

.slide-left-enter, .slide-right-leave-active
  opacity 0
  transform translate(30px, 0)

.slide-left-leave-active, .slide-right-enter
  opacity 0
  transform translate(-30px, 0)

.item-move, .item-enter-active, .item-leave-active
  transition all .5s cubic-bezier(.55,0,.1,1)

.item-enter
  opacity 0
  transform translate(30px, 0)

.item-leave-active
  position absolute
  opacity 0
  transform translate(30px, 0)

@media (max-width 600px)
  .news-list
    margin 10px 0
</style>
