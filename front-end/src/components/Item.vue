<template>
  <li class="news-item">
    <template v-if="item.url">
      <div class="left rail">
        <a :href="item.url">
          <img v-if="item.imageUrl" :src="item.imageUrl" class="preview-img"/>
        </a>
      </div>
      <div class="right rail">
        <a :href="item.url" target="_blank" class="title">{{ item.title }}</a>
        <span class="host"> ({{ url }})</span>
        <div class="description"> {{ item.description }}</div>
        <div class="meta">Posted: {{ timestamp }}</div>
      </div>
    </template>
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
  padding 20px
  border-bottom 1px solid #eee
  line-height 20px
  height 70px
  .rail
    float left
    padding: 0px 5px
    box-sizing border-box
    &.right
      width: 90%
    &.left
      width: 10%
  .preview-img
    width: 100%
    height: 100%
  .description
    font-size .9em
    height 20px
    white-space nowrap
    overflow hidden
    text-overflow: ellipsis
  .title
    color #ff6600
    font-size 1.1em
  .meta, .host
    font-size .85em
    color #999
    a
      color #999
      text-decoration underline
      &:hover
        color #ff6600
</style>
