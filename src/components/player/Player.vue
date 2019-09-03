<template>
  <div class="player" v-show="playList.length > 0">
    <transition name="normal">
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
            <div class="cd-wrapper">
              <div class="cd">
                <img class="cd-img" :src="currentSong.image"/>
              </div>
            </div>
          </div>
        </div>
        <div class="bottom">
          <div class="operators">
            <div class="icon i-left">
              <i class="icon-sequence"></i>
            </div>
            <div class="icon i-left">
              <i class="icon-prev"></i>
            </div>
            <div class="icon i-center">
              <i class="icon-play"></i>
            </div>
            <div class="icon i-right">
              <i class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition>
      <div class="mini-player border-top" v-show="!fullScreen" @click="openFullScreen">
        <div class="mini-l">
          <div class="icon">
            <img class="img-cover" :src="currentSong.image"/>
          </div>
          <div class="text">
            <h2 class="name" v-html="currentSong.name"></h2>
            <p class="desc" v-html="currentSong.singer"></p>
          </div>
        </div>
        <div class="mini-r">
          <div class="control">
            <i class="icon-mini icon-play-mini"></i>
          </div>
          <div class="control">
            <i class="icon-playlist"></i>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'Player',
  computed: {
    ...mapGetters([
      'fullScreen',
      'playList',
      'currentSong'
    ])
  },
  methods: {
    back  () {
      this.setFullScreen(false)
    },
    openFullScreen () {
      this.setFullScreen(true)
    },
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN'
    })
  }
}
</script>

<style lang="stylus" scoped>
  @import '~stylus/variable.styl'
  @import '~stylus/mixin.styl'
  .border-top
    &:before
      border-color #eee
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
            font-size 14px
            color $themeColor
            transform: rotate(-90deg)
        .title
          width 80%
          margin 0 auto
          line-height 40px
          font-size 16px
          color #fff
          text-align center
          ellipsis()
        .subtitle
          line-height 20px
          margin 0 auto
          font-size 13px
          color #fff
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
      .bottom
        position: absolute
        bottom: 1.0rem
        width: 100%
        .operators
          display: flex
          align-items: center
          justify-content space-around
          padding 0 0.30rem
          .icon
            color #fff
            i
              font-size .60rem
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
      background-color $bgColor
      border-top 1px solid #eee
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
          margin-right 8px
          img
            width 100%
            border-radius 50%
        .text
          overflow hidden
          display flex
          flex-direction column
          justify-content center
          line-height 18px
          .name
            font-size 14px
            color $darkTextColor
            ellipsis()
          .desc
            font-size 11px
            color $lightTextColor
            ellipsis()
      .mini-r
        display flex
        justify-content space-between
        width 78px
        padding-right 12px
        .control
          width 30px
          i
            font-size 25px
            color #333
            &.icon-playlist
              color $themeColor
</style>
