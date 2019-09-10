<template>
  <div class="rank" ref="rank">
    <scroll class="top-list" :data="topList" ref="topList">
      <ul>
        <li class="item" v-for="item of topList" :key="item.id" @click="selectItem(item)">
          <div class="img-wrapper">
            <img width="100" height="100" v-lazy="item.picUrl" />
          </div>
          <ul class="song-list">
            <li class="song" v-for="(song, index) of item.songList" :key="index">
              <span>{{index + 1}}</span>
              <span>{{song.songname}} - {{song.singername}}</span>
            </li>
          </ul>
        </li>
      </ul>
      <div class="loading-container" v-show="!topList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import { getTopList } from 'api/rank'
import { ERR_OK } from 'api/config'
import Scroll from 'base/scroll/Scroll'
import Loading from 'base/loading/Loading'
import { playListMixin } from 'common/js/mixin'
import { mapMutations } from 'vuex'
export default {
  name: 'Rank',
  components: {
    Scroll,
    Loading
  },
  mixins: [playListMixin],
  data () {
    return {
      topList: []
    }
  },
  methods: {
    handlePlayList (playList) {
      const bottom = playList.length > 0 ? '60px' : ''
      this.$refs.rank.style.bottom = bottom
      this.$refs.topList.refresh()
    },
    selectItem (item) {
      this.$router.push({
        path: `/rank/${item.id}`
      })
      this.setTopList(item)
    },
    _getTopList () {
      getTopList().then(res => {
        if (res.code === ERR_OK) {
          this.topList = res.data.topList
        }
      })
    },
    ...mapMutations({
      'setTopList': 'SET_TOP_LIST'
    })
  },
  created () {
    this._getTopList()
  }
}
</script>

<style lang="stylus" scoped>
  @import '~stylus/variable.styl'
  @import '~stylus/mixin.styl'
  .rank
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
    .top-list
      overflow: hidden
      width: 100%
      height: 100%
      .item
        display: flex
        align-items: center
        margin: 0 20px
        padding-top: 20px
        height: 100px
        &:last-child
          padding-bottom: 20px
        .img-wrapper
          flex: 0 0 100px
          width: 100px
          height: 100px
        .song-list
          flex: 1
          display: flex
          flex-direction: column
          justify-content: center
          overflow: hidden
          padding: 0 16px
          height: 100px
          color: $textColorG
          background: $bghighLighttColor
          font-size: $font-12
          .song
            ellipsis()
            line-height: 26px
            span
              &:first-child
                margin-right 5px
      .loading-container
        position: absolute
        left: 50%
        top: 50%
        transform: translate(-50%, -50%)
</style>
