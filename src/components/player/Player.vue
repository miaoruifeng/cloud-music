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
        <div class="middle">
          <div class="middle-l">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd">
                <img class="cd-img" :class="cdClass" :src="currentSong.image"/>
              </div>
            </div>
          </div>
        </div>
        <div class="bottom">
          <div class="progress-wrapper">
            <span class="time time-l">{{formatTime(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @percentChange="onProgressBarChange"></progress-bar>
            </div>
            <span class="time time-r">{{formatTime(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left">
              <i class="icon-sequence"></i>
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
              <i class="icon icon-not-favorite"></i>
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
          <div class="control">
            <i class="icon-playlist"></i>
          </div>
        </div>
      </div>
    </transition>
    <audio
      :src="currentSong.url"
      ref="audio"
      @canplay="ready"
      @error="error"
      @timeupdate="updateTime"
    ></audio>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import animations from 'create-keyframe-animation'
import { prefixStyle } from 'common/js/dom'
import ProgressBar from 'base/progress-bar/ProgressBar'
import ProgressCircle from 'base/progress-circle/ProgressCircle'

const transform = prefixStyle('transform')

export default {
  name: 'Player',
  components: {
    ProgressBar,
    ProgressCircle
  },
  data () {
    return {
      songReady: false,
      currentTime: 0
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
      'playList',
      'currentSong',
      'playing',
      'currentIndex'
    ])
  },
  watch: {
    currentSong () {
      this.$nextTick(() => {
        this.$refs.audio.play()
      })
    },
    playing () {
      this.$nextTick(() => {
        const audio = this.$refs.audio
        this.playing ? audio.play() : audio.pause()
      })
    }
  },
  methods: {
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
    },
    handleNextClick () {
      if (!this.songReady) {
        return
      }
      let index = this.currentIndex + 1
      if (index === this.playList.length) {
        index = 0
      }
      this.setCurrentIndex(index)
      if (!this.playing) {
        this.handleTogglePlay()
      }
      this.songReady = true
    },
    handlePrevClick () {
      if (!this.songReady) {
        return
      }
      let index = this.currentIndex - 1
      if (index === 0) {
        index = this.playList.length - 1
      }
      this.setCurrentIndex(index)
      if (!this.playing) {
        this.handleTogglePlay()
      }
      this.songReady = true
    },
    ready () {
      this.songReady = true
    },
    error () {
      this.songReady = true
    },
    updateTime (e) {
      this.currentTime = e.target.currentTime
    },
    formatTime (time) {
      time = time | 0
      let minute = time / 60 | 0
      let second = time % 60
      return `${minute}:${second < 10 ? '0' + second : second}`
    },
    onProgressBarChange (percent) {
      this.$refs.audio.currentTime = this.currentSong.duration * percent
      if (!this.playing) {
        this.handleTogglePlay()
      }
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
      setFullScreen: 'SET_FULL_SCREEN',
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX'
    })
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
      .bottom
        position: absolute
        bottom: 1.0rem
        width: 100%
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
      background-color $bghighLighttColor
      &.mini-enter-active, &.mini-leave-active
        transition all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity 0
      .mini-l
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
