<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="onQueryChange"></search-box>
    </div>
    <div class="shortcut-wrapper" v-show="!query">
      <div class="shortcut">
        <div class="hot-key">
          <h2 class="title">热门搜索</h2>
          <ul>
            <li class="item" v-for="item of hotKey" :key="item.n" @click="addQuery(item.k)">
              <span>{{item.k}}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="suggest-wrapper" v-show="query">
      <suggest :query="query" @listScroll="inputBlur"></suggest>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import SearchBox from 'base/search-box/SearchBox'
import { getHotKey } from 'api/search'
import { ERR_OK } from 'api/config'
import Suggest from 'components/suggest/Suggest'
export default {
  name: 'Search',
  components: {
    SearchBox,
    Suggest
  },
  data () {
    return {
      hotKey: [],
      query: ''
    }
  },
  methods: {
    addQuery (query) {
      this.$refs.searchBox.setQuery(query)
    },
    onQueryChange (query) {
      this.query = query
    },
    inputBlur () {
      this.$refs.searchBox.blur()
    },
    _getHotKey () {
      getHotKey().then(res => {
        if (res.code === ERR_OK) {
          this.hotKey = res.data.hotkey.slice(0, 10)
        }
      })
    }
  },
  created () {
    this._getHotKey()
  }
}
</script>

<style lang="stylus" scoped>
  @import '~stylus/variable.styl'
  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            color: $textColorG
            font-size: $font-14
          .item
            display: inline-block
            margin: 0 20px 10px 0
            padding: 5px 10px
            border-radius: 5px
            color: $textColorD
            font-size: $font-14
            background: $bgHLColor
    .suggest-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      overflow: hidden
</style>
