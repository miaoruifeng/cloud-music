<template>
  <scroll
    class="list-view"
    ref="listview"
    :data="list"
    :probeType="probeType"
    :listenScroll="listenScroll"
    @scroll="scroll"
  >
    <ul>
      <li class="item-group" v-for="(group, index) of list" :key="index" ref="listGroup">
        <h2 class="item-group-title border-bottom">{{group.title}}</h2>
        <ul>
          <li
            class="group-item border-bottom"
            v-for="item of group.items"
            :key="item.id"
            @click="selectItem(item)"
          >
            <img class="item-img" v-lazy="item.avatar" />
            <span class="item-name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div
      class="list-shortcut"
      @touchstart.stop.prevent="onShortcutTouchStart"
      @touchmove.stop.prevent="onShortcutTouchMove"
      @touchend.stop
    >
      <ul>
        <li
          class="item"
          v-for="(item, index) of shortcutList"
          :key="index"
          :data-index="index"
          :class="{'active': currentIndex === index}"
        >
        {{item}}
        </li>
      </ul>
    </div>
    <div class="list-fixed" v-show="fixedTitle" ref="fixedTitle">
      <h2 class="fixed-title">{{fixedTitle}}</h2>
    </div>
    <div class="loading-container" v-show="showLoading">
      <loading></loading>
    </div>
  </scroll>
</template>

<script>
import { getData } from 'common/js/dom'
import Scroll from 'base/scroll/Scroll'
import Loading from 'base/loading/Loading'

const ANCHOR_HEIGHT = 20
const TITLE_HEIGHT = 26

export default {
  name: 'ListView',
  components: {
    Scroll,
    Loading
  },
  props: {
    list: {
      type: Array,
      default: null
    }
  },
  data () {
    return {
      scrollY: -1, // 观测实时滚动位置，默认-1
      currentIndex: 0,
      diff: -1
    }
  },
  computed: {
    showLoading () {
      return !this.list.length
    },
    shortcutList () {
      return this.list.map((group) => {
        return group.title.substr(0, 1)
      })
    },
    fixedTitle () {
      if (this.scrollY > 0) {
        return ''
      }
      return this.list[this.currentIndex] ? this.list[this.currentIndex].title : ''
    }
  },
  watch: {
    // 监听计算高度的时机--list data发生变化时延时计算，数据变化到dom变化时有延时
    list () {
      setTimeout(() => {
        this._calHeight()
      }, 20)
    },
    // 判断scrollY落在哪个区间
    scrollY (newY) {
      const listHeight = this.listHeight
      // 当滚动到顶部 newY>0
      if (newY > 0) {
        this.currentIndex = 0
        return
      }
      // 中间部分滚动
      for (let i = 0; i < listHeight.length - 1; i++) {
        let height1 = listHeight[i]
        let height2 = listHeight[i + 1]
        if (-newY >= height1 && -newY < height2) {
          this.currentIndex = i
          this.diff = height2 + newY
          return
        }
      }
      // 当滚动到底部，newY > 最后一个元素的上限
      this.currentIndex = listHeight.length - 2
    },
    diff (newVal) {
      let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
      if (this.fixedTop === fixedTop) {
        return
      }
      this.fixedTop = fixedTop
      this.$refs.fixedTitle.style.transform = `translate3d(0,${fixedTop}px,0)`
    }
  },
  methods: {
    selectItem (item) {
      this.$emit('select', item)
    },
    onShortcutTouchStart (e) {
      let anchorIndex = getData(e.target, 'index')
      let firstTouch = e.touches[0]
      this.touch.y1 = firstTouch.pageY
      this.touch.anchorIndex = anchorIndex
      this._scrollTo(anchorIndex)
    },
    onShortcutTouchMove (e) {
      let firstTouch = e.touches[0]
      this.touch.y2 = firstTouch.pageY
      let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
      let anchorIndex = parseInt(this.touch.anchorIndex) + delta
      this._scrollTo(anchorIndex)
    },
    // 实时滚动位置通过scroll事件的pos.y赋值得到
    scroll (pos) {
      this.scrollY = pos.y
    },
    refresh () {
      this.$refs.listview.refresh()
    },
    _scrollTo (index) {
      if (!index && index !== 0) {
        return
      }
      if (index < 0) {
        index = 0
      } else if (index > this.listHeight.length - 2) {
        index = this.listHeight.length - 2
      }
      this.scrollY = -this.listHeight[index]
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
    },
    // 计算当前滚动到区域（Grooup）的高度
    _calHeight () {
      this.listHeight = []
      let height = 0
      this.listHeight.push(height)
      const list = this.$refs.listGroup
      for (let i = 0; i < list.length; i++) {
        let item = list[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    }
  },
  created () {
    this.touch = {}
    this.probeType = 3
    this.listenScroll = true
    this.listHeight = []
  },
  beforeMount () {
    // 设置加载默认图片
    this.$Lazyload.config({ loading: require('images/default_user.png') })
  }
}
</script>

<style lang="stylus" scoped>
  @import '~stylus/variable.styl'
  .border-bottom
    &:before
      border-color #ccc
  .list-view
    overflow hidden
    position relative
    width 100%
    height 100%
    .item-group-title
      padding-left 12px
      line-height 26px
      background-color #f0f0f0
      font-size 12px
      color $darkTextColor
    .group-item
      display flex
      align-items center
      padding 0.16rem
      padding-left 12px
      .item-img
        width 0.96rem
        height 0.96rem
        border-radius .06rem
        margin-right 0.24rem
      .item-name
        font-size 13px
        color $grayTextColor
    .list-shortcut
      display flex
      flex-direction column
      justify-content center
      position absolute
      top 0
      bottom 0
      right 0
      z-index 10
      width 20px
      .item
        line-height 20px
        font-size 10px
        color #666
        text-align center
        &.active
          color $themeColor
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        padding-left 12px
        line-height 26px
        background-color #f0f0f0
        font-size 12px
        color $darkTextColor
    .loading-container
      position absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
