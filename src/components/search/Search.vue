<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox"></search-box>
    </div>
    <div class="shortcut-wrapper">
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
  </div>
</template>

<script>
import SearchBox from 'base/search-box/SearchBox'
import { getHotKey } from 'api/search'
import { ERR_OK } from 'api/config'
export default {
  name: 'Search',
  components: {
    SearchBox
  },
  data () {
    return {
      hotKey: []
    }
  },
  methods: {
    addQuery (query) {
      this.$refs.searchBox.setQuery(query)
    },
    _getHotKey () {
      getHotKey().then(res => {
        if (res.code === ERR_OK) {
          console.log(res.data.hotkey)
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
      width: 100
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
</style>
