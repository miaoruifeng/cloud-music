<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="onQueryChange"></search-box>
    </div>
    <div class="shortcut-wrapper" v-show="!query" ref="shortcutWrapper">
      <scroll class="shortcut" :data="shortcut" ref="shortcut">
        <div>
          <div class="hot-key">
            <h2 class="title">热门搜索</h2>
            <ul>
              <li class="item" v-for="item of hotKey" :key="item.n" @click="addQuery(item.k)">
                <span>{{item.k}}</span>
              </li>
            </ul>
          </div>
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜搜历史</span>
              <span class="clear" @click="showConfirm">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <search-list :searches="searchHistory" @select="addQuery" @delete="deleteSearchHistory"></search-list>
          </div>
        </div>
      </scroll>
    </div>
    <div class="suggest-wrapper" v-show="query" ref="suggestWrapper">
      <suggest :query="query" ref="suggest" @listScroll="inputBlur" @select="saveSearch"></suggest>
    </div>
    <confirm text="是否清空所有搜索历史" confirmButtonText="清空" ref="confirm" @confirm="clearSearchHistory"></confirm>
    <router-view></router-view>
  </div>
</template>

<script>
import SearchBox from 'base/search-box/SearchBox'
import { getHotKey } from 'api/search'
import { ERR_OK } from 'api/config'
import Suggest from 'components/suggest/Suggest'
import { mapActions } from 'vuex'
import SearchList from 'base/search-list/SearchList'
import Confirm from 'base/confirm/Confirm'
import Scroll from 'base/scroll/Scroll'
import { playListMixin, searchMixin } from 'common/js/mixin'
export default {
  name: 'Search',
  components: {
    SearchBox,
    Suggest,
    SearchList,
    Confirm,
    Scroll
  },
  mixins: [playListMixin, searchMixin],
  data () {
    return {
      hotKey: []
    }
  },
  computed: {
    shortcut () {
      return this.hotKey.concat(this.searchHistory)
    }
  },
  watch: {
    query (newQuery) {
      if (!newQuery) {
        setTimeout(() => {
          this.$refs.shortcut.refresh()
        }, 20)
      }
    }
  },
  methods: {
    handlePlayList (playList) {
      const bottom = playList.length > 0 ? '60px' : ''
      this.$refs.shortcutWrapper.style.bottom = bottom
      this.$refs.shortcut.refresh()
      this.$refs.suggestWrapper.style.bottom = bottom
      this.$refs.suggest.refresh()
    },
    /*
      有的时候需要一个 method方法 调用 mapActions
      若发现发方法仅仅是调用action 且参数也一样 则可以省略 method定义
      因为此时相当于给action上已经挂method了
      所有此时可以直接把action用到dom上
    */
    // deleteOne (item) {
    //   this.deleteSearchHistory(item)
    // },
    // deleteAll () {
    //   this.clearSearchHistory()
    // },
    showConfirm () {
      this.$refs.confirm.show()
    },
    _getHotKey () {
      getHotKey().then(res => {
        if (res.code === ERR_OK) {
          this.hotKey = res.data.hotkey.slice(0, 10)
        }
      })
    },
    ...mapActions([
      'clearSearchHistory'
    ])
  },
  created () {
    this._getHotKey()
  }
}
</script>

<style lang="stylus" scoped>
  @import '~stylus/variable.styl'
  @import '~stylus/mixin.styl'
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
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            line-height: 40px
            font-size: $font-14
            color: $textColorG
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-14
                color: $textColorG
    .suggest-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      overflow: hidden
</style>
