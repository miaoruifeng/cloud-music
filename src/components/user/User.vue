<template>
  <transition name="slide">
    <div class="user-container">
      <div class="back" @click="back">
        <i class="icon-back"></i>
      </div>
      <div class="switches-wrapper">
        <switches :currentIndex="currentIndex" :switches="switches" @switch="switchItem"></switches>
      </div>
      <div class="play-btn" ref="playBtn" @click="random">
        <i class="icon-play"></i>
        <span class="text">随机播放全部</span>
      </div>
      <div class="list-wrapper" ref="listWrapper">
        <scroll class="list-scroll" v-if="currentIndex===0" :data="favoriteList" ref="favoriteList">
          <div class="list-inner">
            <song-list :songs="favoriteList" @select="selectSong"></song-list>
          </div>
        </scroll>
        <scroll class="list-scroll" v-if="currentIndex===1" :data="playHistory" ref="playList">
          <div class="list-inner">
            <song-list :songs="playHistory" @select="selectSong"></song-list>
          </div>
        </scroll>
      </div>
      <div class="no-result-wrapper" v-show="noResult">
        <no-result :text="noResultDesc"></no-result>
      </div>
    </div>
  </transition>
</template>

<script>
import Switches from 'base/switches/Switches'
import { mapGetters, mapActions } from 'vuex'
import Scroll from 'base/scroll/Scroll'
import SongList from 'base/song-list/SongList'
import Song from 'common/js/song'
import { playListMixin } from 'common/js/mixin'
import NoResult from 'base/no-result/NoResult'
export default {
  name: 'User',
  components: {
    Switches,
    Scroll,
    SongList,
    NoResult
  },
  mixins: [playListMixin],
  data () {
    return {
      currentIndex: 0,
      switches: [
        {name: '我喜欢的'},
        {name: '最近听的'}
      ]
    }
  },
  computed: {
    noResult () {
      if (this.currentIndex === 0) {
        return !this.favoriteList.length
      } else {
        return !this.playHistory.length
      }
    },
    noResultDesc () {
      if (this.currentIndex === 0) {
        return '暂无收藏歌曲'
      } else {
        return '你还没有听过歌曲'
      }
    },
    ...mapGetters([
      'favoriteList',
      'playHistory'
    ])
  },
  methods: {
    handlePlayList (playList) {
      const bottom = playList.length > 0 ? '60px' : ''
      this.$refs.listWrapper.style.bottom = bottom
      this.$refs.favoriteList && this.$refs.favoriteList.refresh()
      this.$refs.playList && this.$refs.playList.refresh()
    },
    switchItem (index) {
      this.currentIndex = index
    },
    selectSong (song) {
      this.insertSong(new Song(song))
    },
    back () {
      this.$router.back()
    },
    random () {
      let list = this.currentIndex === 0 ? this.favoriteList : this.playHistory
      if (list.length === 0) {
        return
      }
      list = list.map((song) => {
        return new Song(song)
      })
      this.randomPlay({
        list
      })
    },
    ...mapActions([
      'insertSong',
      'randomPlay'
    ])
  }
}
</script>

<style lang="stylus" scoped>
  @import '~stylus/variable.styl'
  .user-container
    z-index: 100
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    background: $bgColor
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
    .back
      position: absolute
      left: 6px
      top: 4px
      .icon-back
        display: block
        padding: 10px
        font-size: $font-16
        color: $themeColor
    .switches-wrapper
      margin: 7px 0 30px 0
    .play-btn
      margin: 0 auto
      width: 135px
      padding: 7px 0
      box-sizing: border-box
      border: 1px solid $textColorG
      border-radius: 100px
      text-align: center
      font-size: 0
      color: $textColorG
      .icon-play
        display: inline-block
        margin-right: 6px
        vertical-align: middle
        font-size: $font-16
      .text
        display: inline-block
        vertical-align: middle
        font-size: $font-12
    .list-wrapper
      position: absolute
      top: 110px
      bottom: 0
      width: 100%
      .list-scroll
        height: 100%
        overflow: hidden
        .list-inner
          padding: 15px 25px
    .no-result-wrapper
      position: absolute
      left: 0
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
