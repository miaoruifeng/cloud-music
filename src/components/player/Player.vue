<template>
  <div class="player" v-show="playList.length > 0">
    <transition
      name="normal"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave"
    >
      <div class="normal-player" v-show="fullScreen">
        <div class="bg-wrapper">
          <img class="bg-img" :src="currentSong.image"/>
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div
          class="middle"
          @touchstart.prevent="middleTouchStart"
          @touchmove.prevent="middleTouchMove"
          @touchend="middleTouchEnd"
        >
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd">
                <img class="cd-img" :class="cdClass" :src="currentSong.image"/>
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <p class="playing-lyric">{{playingLyric}}</p>
            </div>
          </div>
          <scroll class="middle-r" :data="currentLyric && currentLyric.lines" ref="lyricList">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p
                  class="lyric"
                  :class="{'current': currentLineNum === index}"
                  v-for="(item, index) of currentLyric.lines"
                  :key="index"
                  ref="lyricLine"
                >{{item.txt}}</p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active': currentShow ==='cd'}"></span>
            <span class="dot" :class="{'active': currentShow ==='lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{formatTime(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @percentChange="onProgressBarChange"></progress-bar>
            </div>
            <span class="time time-r">{{formatTime(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left" @click="changeMode">
              <i :class="iconMode"></i>
            </div>
            <div class="icon i-left" :class="disableClass">
              <i class="icon-prev" @click="handlePrevClick"></i>
            </div>
            <div class="icon i-center" :class="disableClass">
              <i :class="iconPlay" @click="handleTogglePlay"></i>
            </div>
            <div class="icon i-right" :class="disableClass">
              <i class="icon-next" @click="handleNextClick"></i>
            </div>
            <div class="icon i-right">
              <i class="icon" :class="getFavoriteIcon(currentSong)" @click="toggleFavorite(currentSong)"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition>
      <div class="mini-player" v-show="!fullScreen" @click="openFullScreen">
        <div class="mini-l">
          <div class="icon">
            <img class="img-cover" :class="cdClass" :src="currentSong.image"/>
          </div>
          <div class="text">
            <h2 class="name" v-html="currentSong.name"></h2>
            <p class="desc" v-html="currentSong.singer"></p>
          </div>
        </div>
        <div class="mini-r">
          <div class="control">
            <progress-circle :radius="32" :percent="percent">
              <i class="icon-mini" :class="iconMini" @click.stop="handleTogglePlay"></i>
            </progress-circle>
          </div>
          <div class="control" @click.stop="showPlaylist">
            <i class="icon-playlist"></i>
          </div>
        </div>
      </div>
    </transition>
    <playlist ref="playlist"></playlist>
    <audio
      :src="currentSong.url"
      ref="audio"
      @play="ready"
      @error="error"
      @timeupdate="updateTime"
      @ended="end"
    ></audio>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import animations from 'create-keyframe-animation'
import { prefixStyle } from 'common/js/dom'
import ProgressBar from 'base/progress-bar/ProgressBar'
import ProgressCircle from 'base/progress-circle/ProgressCircle'
import { playMode } from 'common/js/config'
import Lyric from 'lyric-parser'
import Scroll from 'base/scroll/Scroll'
import Playlist from 'components/playlist/Playlist'
import { playerMixin } from 'common/js/mixin'

const transform = prefixStyle('transform')
const transitionDuration = prefixStyle('transitionDuration')

export default {
  name: 'Player',
  components: {
    ProgressBar,
    ProgressCircle,
    Scroll,
    Playlist
  },
  mixins: [playerMixin],
  data () {
    return {
      songReady: false,
      currentTime: 0,
      currentLyric: null,
      currentLineNum: 0,
      currentShow: 'cd',
      playingLyric: ''
    }
  },
  computed: {
    iconPlay () {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    iconMini () {
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
    },
    cdClass () {
      return this.playing ? 'play' : 'play pause'
    },
    disableClass () {
      return this.songReady ? '' : 'disable'
    },
    percent () {
      return this.currentTime / this.currentSong.duration
    },
    ...mapGetters([
      'fullScreen',
      'playing',
      'currentIndex'
    ])
  },
  methods: {
    /* 控制播放列表相关 */
    showPlaylist () {
      this.$refs.playlist.show()
    },
    /* normal - mini播放器之前的切换 */
    // 点击左上角按钮切换到mini播放器
    back () {
      this.setFullScreen(false)
    },
    // 点击mini播放器切换到全屏播放
    openFullScreen () {
      this.setFullScreen(true)
    },
    // normal - mini切换动画
    enter (el, done) {
      const {x, y, scale} = this._getPosAndScale()
      let animation = {
        0: {
          transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0,0,0) scale(1.1)`
        },
        100: {
          transform: `translate3d(0,0,0) scale(1)`
        }
      }
      animations.registerAnimation({
        name: 'move',
        animation,
        presets: {
          duration: 400,
          easing: 'linear'
        }
      })
      animations.runAnimation(this.$refs.cdWrapper, 'move', done)
    },
    afterEnter () {
      animations.unregisterAnimation('move')
      this.$refs.cdWrapper.style.animation = ''
    },
    leave (el, done) {
      this.$refs.cdWrapper.style.transition = 'all 0.4s'
      const {x, y, scale} = this._getPosAndScale()
      this.$refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`
      this.$refs.cdWrapper.addEventListener('transitionend', done)
    },
    afterLeave () {
      this.$refs.cdWrapper.style.transition = ''
      this.$refs.cdWrapper.style[transform] = ''
    },
    handleTogglePlay () {
      if (!this.songReady) {
        return
      }
      this.setPlayingState(!this.playing)
      if (this.currentLyric) {
        this.currentLyric.togglePlay()
      }
    },
    handleNextClick () {
      if (!this.songReady) {
        return
      }
      if (this.playList.length === 1) {
        this.loop()
        return
      } else {
        let index = this.currentIndex + 1
        if (index === this.playList.length) {
          index = 0
        }
        this.setCurrentIndex(index)
        if (!this.playing) {
          this.handleTogglePlay()
        }
      }
      this.songReady = true
    },
    handlePrevClick () {
      if (!this.songReady) {
        return
      }
      if (this.playList.length === 1) {
        this.loop()
        return
      } else {
        let index = this.currentIndex - 1
        if (index === 0) {
          index = this.playList.length - 1
        }
        this.setCurrentIndex(index)
        if (!this.playing) {
          this.handleTogglePlay()
        }
      }
      this.songReady = true
    },
    ready () {
      this.songReady = true
      this.savePlayHistory(this.currentSong)
    },
    error () {
      this.songReady = true
    },
    updateTime (e) {
      this.currentTime = e.target.currentTime
    },
    end () {
      if (this.mode === playMode.loop) {
        this.loop()
      } else {
        this.handleNextClick()
      }
    },
    loop () {
      this.$refs.audio.currentTime = 0
      this.$refs.audio.play()
      this.setPlayingState(true)
      if (this.currentLyric) {
        this.currentLyric.seek(0)
      }
    },
    formatTime (time) {
      time = time | 0
      let minute = time / 60 | 0
      let second = time % 60
      return `${minute}:${second < 10 ? '0' + second : second}`
    },
    onProgressBarChange (percent) {
      const currentTime = this.currentSong.duration * percent
      this.$refs.audio.currentTime = currentTime
      if (!this.playing) {
        this.handleTogglePlay()
      }
      if (this.currentLyric) {
        this.currentLyric.seek(currentTime * 1000)
      }
    },
    // changeMode()共享
    // 歌词每一行发生改变时 回调
    handleLyric ({lineNum, txt}) {
      this.currentLineNum = lineNum
      if (lineNum > 5) {
        let lineEl = this.$refs.lyricLine[lineNum - 5]
        this.$refs.lyricList.scrollToElement(lineEl, 1000)
      } else {
        this.$refs.lyricList.scrollTo(0, 0, 1000)
      }
      this.playingLyric = txt
    },
    middleTouchStart (e) {
      this.touch.initiated = true
      const touch = e.touches[0]
      this.touch.startX = touch.pageX
      this.touch.startY = touch.pageY
    },
    middleTouchMove (e) {
      if (!this.touch.initiated) {
        return
      }
      const touch = e.touches[0]
      const deltaX = touch.pageX - this.touch.startX
      const deltaY = touch.pageY - this.touch.startY
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        return
      }
      const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
      const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
      this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
      this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
      this.$refs.lyricList.$el.style[transitionDuration] = 0
      this.$refs.middleL.style.opacity = 1 - this.touch.percent
      this.$refs.middleL.style[transitionDuration] = 0
    },
    middleTouchEnd () {
      let offsetWidth
      let opacity
      let durationTime = 300
      if (this.currentShow === 'cd') {
        if (this.touch.percent > 0.1) {
          offsetWidth = -window.innerWidth
          opacity = 0
          this.currentShow = 'lyric'
        } else {
          offsetWidth = 0
          opacity = 1
        }
      } else {
        if (this.touch.percent < 0.9) {
          offsetWidth = 0
          opacity = 1
          this.currentShow = 'cd'
        } else {
          offsetWidth = -window.innerWidth
          opacity = 0
        }
      }
      this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
      this.$refs.lyricList.$el.style[transitionDuration] = `${durationTime}ms`
      this.$refs.middleL.style.opacity = opacity
      this.$refs.middleL.style[transitionDuration] = `${durationTime}ms`
    },
    // 获取歌词
    _getLyric () {
      this.currentSong.getLyric().then(lyric => {
        if (this.currentSong.lyric !== lyric) {
          return
        }
        this.currentLyric = new Lyric(lyric, this.handleLyric)
        if (this.playing) {
          this.currentLyric.play()
        }
        // console.log(this.currentLyric)
      }).catch(() => {
        this.currentLyric = null
        this.playingLyric = ''
        this.currentLineNum = 0
      })
    },
    // normal - mini之间切换，获取初始位置和大小方法
    _getPosAndScale () {
      const targetWidth = 40
      const paddingLeft = 32
      const paddingBottom = 30
      const paddingTop = 80
      const width = window.innerWidth * 0.8
      const scale = targetWidth / width
      const x = -(window.innerWidth / 2 - paddingLeft)
      const y = window.innerHeight - paddingTop - width / 2 - paddingBottom
      return {
        x,
        y,
        scale
      }
    },
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN'
    }),
    ...mapActions([
      'savePlayHistory'
    ])
  },
  watch: {
    currentSong (newSong, oldSong) {
      if (!newSong.id) {
        return
      }
      if (newSong.id === oldSong.id) {
        return
      }
      if (this.currentLyric) {
        this.currentLyric.stop()
        this.currentLineNum = 0
        this.currentTime = 0
        this.currentLyric = null
      }
      // this.$nextTick(() => {
      //   this.$refs.audio.play()
      //   this._getLyric()
      // })
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.$refs.audio.play()
        this._getLyric()
      }, 1000)
    },
    playing () {
      this.$nextTick(() => {
        const audio = this.$refs.audio
        this.playing ? audio.play() : audio.pause()
      })
    }
  },
  created () {
    this.touch = {}
  }
}
</script>

<style lang="stylus" scoped>
  @import '~stylus/variable.styl'
  @import '~stylus/mixin.styl'
  .player
    .normal-player
      z-index 200
      position fixed
      top 0
      left 0
      bottom 0
      right 0
      background-color $bgColor
      .bg-wrapper
        z-index: -1
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        opacity: 0.6
        filter: blur(20px)
        .bg-img
          width 100%
          height 100%
      .top
        position relative
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
            display inline-block
            font-size $font-16
            color $themeColor
            transform: rotate(-90deg)
        .title
          width 80%
          margin 0 auto
          line-height 40px
          font-size $font-16
          color $textColorL
          text-align center
          ellipsis()
        .subtitle
          line-height 20px
          margin 0 auto
          font-size $font-13
          color $textColorL
          text-align center
          ellipsis()
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          position: relative
          display: inline-block
          width: 100%
          height: 0
          padding-top: 80%
          vertical-align: top
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              overflow hidden
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              .cd-img
                // position: absolute
                // left: 0
                // top: 0
                width: 100%
                height: 100%
                border-radius: 50%
                &.play
                  animation: rotate 20s linear infinite
                &.pause
                  animation-play-state: paused
          .playing-lyric-wrapper
            overflow: hidden
            margin: 30px auto 0 auto
            width: 80%
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-14
              color: $textColorL
        .middle-r
          display: inline-block
          width: 100%
          height: 100%
          vertical-align: top
          overflow: hidden
          .lyric-wrapper
            margin: 0 auto
            width: 80%
            text-align: center
            overflow: hidden
            .lyric
              line-height: 32px
              font-size: $font-14
              color: $textColorG
              &.current
                color: $textColorL
      .bottom
        position: absolute
        bottom: 1.0rem
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $textColorG
            &.active
              width: 20px
              border-radius: 5px
              color: $textColorGL
        .progress-wrapper
          display flex
          justify-content center
          align-items center
          width 80%
          margin 0 auto
          padding 10px 0
          .time
            width 30px
            line-height 30px
            color $textColorL
            font-size $font-12
            &.time-r
              text-align right
          .progress-bar-wrapper
            flex 1
        .operators
          display: flex
          align-items: center
          justify-content space-around
          padding 0 0.30rem
          color $themeColor
          .icon
            i
              font-size 30px
              &.icon-favorite
                color $themeColorSub
      &.normal-enter-active, &.normal-leave-active
        transition all 0.4s
        .top, .bottom
          transition all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity 0
        .top
          transform translate3d(0, -100px, 0)
        .bottom
          transform translate3d(0, 100px, 0)
    .mini-player
      z-index 200
      position fixed
      left 0
      bottom 0
      display flex
      justify-content space-between
      align-items center
      width 100%
      height 60px
      background-color $bgHLColor
      &.mini-enter-active, &.mini-leave-active
        transition all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity 0
      .mini-l
        overflow hidden
        flex 1
        display flex
        padding-left 12px
        .icon
          width 40px
          height 40px
          margin-right 10px
          .img-cover
            width 100%
            border-radius 50%
            &.play
              animation: rotate 20s linear infinite
            &.pause
              animation-play-state: paused
        .text
          overflow hidden
          display flex
          flex-direction column
          justify-content center
          line-height 20px
          .name
            font-size $font-13
            color $textColorGL
            ellipsis()
          .desc
            font-size $font-10
            color $textColorG
            ellipsis()
      .mini-r
        display flex
        justify-content space-between
        width 78px
        padding-right 12px
        .control
          width 30px
          .icon-playlist, .icon-play-mini, .icon-pause-mini
            font-size: 30px
            color: $darkThemeColor
          .icon-mini
            position: absolute
            left: 0
            top: 0
            font-size: 32px
  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>
