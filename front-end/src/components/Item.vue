<template>
  <li class="news-item">
    <span class="title">
      <template v-if="item.url">
        <a :href="item.url" target="_blank">{{ item.title }}</a>
        <span class="host"> ({{ item.description }})</span>
        <span class="host"> ({{ item.url }})</span>
      </template>
      <template v-else>
        <router-link :to="'/item/' + item.url">{{ item.title }}</router-link>
      </template>
    </span>
    <br>
    <span class="meta">
      <span class="time">
        Posted: {{ item.timestamp }}
      </span>
    </span>
  </li>
</template>

<script>
import { timeAgo } from '../filters'

export default {
  name: 'news-item',
  props: ['item'],
  // https://github.com/vuejs/vue/blob/next/packages/vue-server-renderer/README.md#component-caching
  serverCacheKey: props => {
    return `${
      props.item.timestamp
    }::${
      props.item.__lastUpdated
    }::${
      timeAgo(props.item.time)
    }`
  }
}
</script>

<style lang="stylus">
.news-item
  background-color #fff
  padding 20px 30px 20px 80px
  border-bottom 1px solid #eee
  position relative
  line-height 20px
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
