<template>
  <transition name="list-fade">
    <div class="playlist" v-show="showFlag" @click="hide">
      <div class="list-wrapper" @click.stop>
        <div class="list-header">
          <h1 class="title">
            <i class="icon" :class="iconMode" @click="changeMode"></i>
            <span class="text">{{modeText}}</span>
            <span class="add">
              <i class="icon-add"></i>
              添加歌曲到队列
            </span>
            <span class="clear" @click="showConfirm">
              <i class="icon-clear"></i>
            </span>
          </h1>
        </div>
        <scroll class="list-content" :data="sequenceList" ref="listContent">
          <transition-group tag="ul" name="list">
            <li
              class="item"
              v-for="(item, index) in sequenceList"
              :key="item.id"
              ref="listItem"
              @click="selectItem(item, index)"
            >
              <i class="current" :class="getCurrentClass(item)"></i>
              <span class="text">{{item.name}}</span>
              <span class="like">
                <i class="icon-not-favorite"></i>
              </span>
              <span class="delete" @click.stop="deleteOne(item)">
                <i class="icon-delete"></i>
              </span>
            </li>
          </transition-group>
        </scroll>
        <div class="list-close" @click="hide">
          <span>关闭</span>
        </div>
      </div>
      <confirm text="是否情况播放列表" confirmButtonText="清空" ref="confirm" @confirm="clearSongList"></confirm>
    </div>
  </transition>
</template>

<script>
import { mapActions } from 'vuex'
import { playMode } from 'common/js/config'
import Scroll from 'base/scroll/Scroll'
import Confirm from 'base/confirm/Confirm'
import { playerMixin } from 'common/js/mixin'
export default {
  name: 'PlayList',
  components: {
    Scroll,
    Confirm
  },
  mixins: [playerMixin],
  data () {
    return {
      showFlag: false
    }
  },
  computed: {
    modeText () {
      return this.mode === playMode.sequence ? '顺序播放' : this.mode === playMode.loop ? '单曲循环' : '随机播放'
    }
  },
  methods: {
    show () {
      this.showFlag = true
      setTimeout(() => {
        this.$refs.listContent.refresh()
        this.scrollToCurrent(this.currentSong)
      }, 20)
    },
    hide () {
      this.showFlag = false
    },
    getCurrentClass (item) {
      if (this.currentSong.id === item.id) {
        return 'icon-play'
      }
      return ''
    },
    selectItem (item, index) {
      if (this.mode === playMode.random) {
        index = this.playList.findIndex((song) => {
          return song.id === item.id
        })
      }
      this.setCurrentIndex(index)
      this.setPlayingState(true)
    },
    scrollToCurrent (current) {
      const index = this.sequenceList.findIndex((song) => {
        return current.id === song.id
      })
      this.$refs.listContent.scrollToElement(this.$refs.listItem[index], 100)
    },
    deleteOne (item) {
      this.deleteSong(item)
      if (!this.playList.length) {
        this.hide()
      }
    },
    showConfirm () {
      this.$refs.confirm.show()
    },
    clearSongList () {
      this.clearSongList()
      this.hide()
    },
    ...mapActions([
      'deleteSong',
      'clearSongList'
    ])
  },
  watch: {
    currentSong (newSong, oldSong) {
      if (!this.showFlag || newSong.id === oldSong.id) {
        return
      }
      this.scrollToCurrent(newSong)
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import '~stylus/variable.styl'
  @import '~stylus/mixin.styl'
  .playlist
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    z-index: 200
    background-color: $bgDarkColor
    &.list-fade-enter-active, &.list-fade-leave-active
      transition: opacity 0.3s
      .list-wrapper
        transition: all 0.3s
    &.list-fade-enter, &.list-fade-leave-to
      opacity: 0
      .list-wrapper
        transform: translate3d(0, 100%, 0)
    &.list-fade-enter
    .list-wrapper
      position: absolute
      left: 0
      bottom: 0
      width: 100%
      background-color: $bgHLColor
      .list-header
        position: relative
        padding: 20px 30px 10px 20px
        .title
          display: flex
          align-items: center
          .icon
            margin-right: 10px
            font-size: 26px
            color: $darkThemeColor
          .text
            flex: 1
            font-size: $font-14
            color: $textColorG
          .add
            extend-click()
            margin-right: 25px
            font-size: $font-12
            color: $textColorD
          .clear
            extend-click()
            .icon-clear
              font-size: $font-14
              color: $textColorG
      .list-content
        max-height: 240px
        overflow: hidden
        .item
          display: flex
          align-items: center
          height: 40px
          padding: 0 30px 0 20px
          overflow: hidden
          &.list-enter-active, &.list-leave-active
            transition: all 0.1s
          &.list-enter, &.list-leave-to
            height: 0
          .current
            flex: 0 0 20px
            width: 20px
            font-size: $font-12
            color: $darkThemeColor
          .text
            flex: 1
            font-size: $font-14
            color: $textColorD
            ellipsis()
          .like
            extend-click()
            margin-right: 15px
            font-size: $font-12
            color: $themeColor
            .icon-favorite
              color: $themeColorSub
          .delete
            extend-click()
            font-size: $font-12
            color: $themeColor
      .list-close
        text-align: center
        line-height: 50px
        background: $bgColor
        font-size: $font-16
        color: $textColorG
</style>
