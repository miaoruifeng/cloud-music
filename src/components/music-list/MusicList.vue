<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-img" :style="bgStyle" ref="bgImg">
      <div class="mask" ref="mask"></div>
      <div class="play-wrapper">
        <div class="play" ref="playBtn" v-show="songs.length > 0" @click="random">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
    </div>
    <div class="bg-layer" ref="bgLayer"></div>
    <scroll
      class="list"
      :data="songs"
      :probe-type="probeType"
      :listen-scroll="listenScroll"
      ref="list"
      @scroll="scroll"
    >
      <div class="song-list-wrapper">
        <song-list :songs="songs" :rank="rank" @select="selectItem"></song-list>
      </div>
      <div class="loading-container" v-show="!songs.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { prefixStyle } from 'common/js/dom'
import Scroll from 'base/scroll/Scroll'
import SongList from 'base/song-list/SongList'
import Loading from 'base/loading/Loading'
import { playListMixin } from 'common/js/mixin'

const RESERVED_HEIGHT = 40
const transform = prefixStyle('transform')
// const backdrop = prefixStyle('backdrop-filter')
export default {
  name: 'MusicList',
  components: {
    Scroll,
    SongList,
    Loading
  },
  mixins: [playListMixin],
  props: {
    title: {
      type: String,
      default: ''
    },
    bgImg: {
      type: String,
      default: ''
    },
    songs: {
      type: Array,
      default: null
    },
    rank: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      scrollY: 0
    }
  },
  computed: {
    bgStyle () {
      return `backgroundImage: url(${this.bgImg})`
    }
  },
  methods: {
    handlePlayList (playList) {
      const bottom = playList.length > 0 ? '60px' : ''
      this.$refs.list.$el.style.bottom = bottom
      this.$refs.list.refresh()
    },
    scroll (pos) {
      this.scrollY = pos.y
    },
    back () {
      this.$router.back()
    },
    selectItem (item, index) {
      this.selectPlay({
        list: this.songs,
        index
      })
    },
    random () {
      this.randomPlay({
        list: this.songs
      })
    },
    ...mapActions([
      'selectPlay',
      'randomPlay'
    ])
  },
  watch: {
    scrollY (newY) {
      let traslateY = Math.max(this.minTransalteY, newY)
      let zIndex = 0
      let scale = 1
      let blur = 0
      const percent = Math.abs(newY / this.bgImgHeight)
      if (newY > 0) {
        scale = 1 + percent
        zIndex = 10
      } else {
        blur = Math.min(20, percent * 20)
      }
      this.$refs.bgLayer.style[transform] = `translate3d(0, ${traslateY}px, 0)`
      this.$refs.mask.style['backdrop-filter'] = `blur(${blur}px)`
      this.$refs.mask.style['webkitBackdrop-filter'] = `blur(${blur}px)`
      if (newY < this.minTransalteY) {
        zIndex = 10
        this.$refs.bgImg.style.height = `${RESERVED_HEIGHT}px`
        this.$refs.bgImg.style.paddingTop = 0
        this.$refs.playBtn.style.display = 'none'
      } else {
        this.$refs.bgImg.style.height = 0
        this.$refs.bgImg.style.paddingTop = '70%'
        this.$refs.playBtn.style.display = ''
      }
      this.$refs.bgImg.style.zIndex = zIndex
      this.$refs.bgImg.style[transform] = `scale(${scale})`
    }
  },
  created () {
    this.probeType = 3
    this.listenScroll = true
  },
  mounted () {
    this.bgImgHeight = this.$refs.bgImg.clientHeight
    this.minTransalteY = -this.bgImgHeight + RESERVED_HEIGHT
    this.$refs.list.$el.style.top = `${this.bgImgHeight}px`
  }
}
</script>

<style lang="stylus" scoped>
  @import '~stylus/variable.styl'
  @import '~stylus/mixin.styl'
  .music-list
    z-index 100
    position fixed
    top 0
    left 0
    bottom 0
    right 0
    background-color $bgColor
    .back
      z-index 50
      position absolute
      top 0
      left 0
      width 40px
      height 40px
      line-height 40px
      text-align center
      .icon-back
        font-size $font-16
        color $themeColor
    .title
      z-index 50
      position absolute
      top 0
      left 10%
      width 80%
      line-height 40px
      font-size $font-16
      color $textColorL
      text-align center
      ellipsis()
    .bg-img
      position relative
      width 100%
      height 0
      padding-top 70%
      background-size cover
      transform-origin top
      .mask
        position absolute
        top 0
        left 0
        width 100%
        height 100%
        background-color rgba(7, 17, 27, 0.4)
      .play-wrapper
        z-index: 50
        position: absolute
        bottom: 20px
        width: 100%
        .play
          display flex
          justify-content center
          align-items center
          width: 135px
          padding: 7px 0
          margin: 0 auto
          box-sizing: border-box
          border: 1px solid $themeColor
          border-radius: 100px
          color: $themeColor
          text-align: center
          .icon-play
            margin-right: 6px
            font-size: $font-15
          .text
            font-size: $font-13
    .bg-layer
      position relative
      height 100%
      background-color $bgColor
    .list
      // overflow hidden
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      background-color: $bgColor
      .song-list-wrapper
        padding 15px 25px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
