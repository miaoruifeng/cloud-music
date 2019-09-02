<template>
  <div class="music-list">
    <h1 class="title" v-html="title"></h1>
    <div class="back">
      <i class="icon-back"></i>
    </div>
    <div class="bg-img" :style="bgStyle" ref="bgImg">
      <div class="mask"></div>
    </div>
    <scroll class="list" :data="songs" ref="list">
      <div class="song-list-wrapper">
        <song-list :songs="songs"></song-list>
      </div>
    </scroll>
  </div>
</template>

<script>
import Scroll from 'base/scroll/Scroll'
import SongList from 'base/song-list/SongList'
export default {
  name: 'MusicList',
  components: {
    Scroll,
    SongList
  },
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
    }
  },
  computed: {
    bgStyle () {
      return `backgroundImage: url(${this.bgImg})`
    }
  },
  mounted () {
    this.bgImgHeight = this.$refs.bgImg.clientHeight
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
    .title
      z-index 50
      position absolute
      top 0
      left 10%
      width 80%
      line-height 40px
      font-size 16px
      color #fff
      text-align center
      ellipsis()
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
        font-size 14px
        color $themeColor
    .bg-img
      position relative
      width 100%
      height 0
      padding-top 70%
      background-size cover
      .mask
        position absolute
        top 0
        left 0
        width 100%
        height 100%
        background-color rgba(7, 17, 27, 0.4)
    .list
      overflow hidden
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      background-color: $bgColor
</style>
