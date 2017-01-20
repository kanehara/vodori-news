<template>
  <li class="news-item">
    <template v-if="item.url">
      <a :href="item.url" target="_blank" class="title">{{ item.title }}</a>
      <span class="host"> ({{ url }})</span>
      <br/>
      <span class="description"> {{ item.description }}</span>
      <br/>
    </template>
    <span class="meta">
      <span class="time">
        Posted: {{ timestamp }}
      </span>
    </span>
  </li>
</template>

<script>
import { timeAgo } from '../filters'

export default {
  name: 'news-item',
  props: ['item'],
  serverCacheKey: props => {
    return `${
      props.item.timestamp
    }`
  },
  computed: {
      timestamp() {
          let date = new Date(this.item.timestamp)
          return date && date.toDateString()
      },
      url() {
          let url = this.item.url
          // Remove http://www.
          url = url.replace(/.*?:\/\/(www\.)?/g, "")
          // Get domain
          return url.split('/')[0]
      }
  }
}
</script>

<style lang="stylus" scoped>
.news-item
  background-color #fff
  padding 20px 30px 20px 80px
  border-bottom 1px solid #eee
  position relative
  line-height 20px
  .description
    font-size .9em
  .title
    color #ff6600
    font-size 1.1em
  .score
    color #ff6600
    font-size 1.1em
    font-weight 700
    position absolute
    top 50%
    left 0
    width 80px
    text-align center
    margin-top -10px
  .meta, .host
    font-size .85em
    color #999
    a
      color #999
      text-decoration underline
      &:hover
        color #ff6600
</style>
