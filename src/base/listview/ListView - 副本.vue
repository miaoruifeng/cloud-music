<template>
  <scroll
    class="listview"
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
          <li class="item border-bottom" v-for="item of group.items" :key="item.id">
            <img class="item-img" v-lazy="item.avatar" />
            <span class="item-name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
  </scroll>
</template>

<script>
import Scroll from 'base/scroll/Scroll'
export default {
  name: 'ListView',
  components: {
    Scroll
  },
  props: {
    list: {
      type: Array,
      default: null
    },
    anchorIndex: {
      type: [String, Number],
      default: ''
    }
  },
  data () {
    return {
      scrollY: -1, // 观测实时滚动位置，默认-1
      currentIndex: 0
    }
  },
  watch: {
    anchorIndex () {
      if (this.anchorIndex) {
        this.$refs.listview.scrollToElement(this.$refs.listGroup[this.anchorIndex], 1)
      }
    },
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
        if (-newY >= height1 && -newY <= height2) {
          this.currentIndex = i
          return
        }
      }
      // 当滚动到底部，newY > 最后一个元素的上限
      this.currentIndex = listHeight.length - 2
    }
  },
  methods: {
    // 实时滚动位置通过scroll事件的pos.y赋值得到
    scroll (pos) {
      this.scrollY = pos.y
      this.$emit('change', this.currentIndex)
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
  .listview
    overflow hidden
    width 100%
    height 100%
    .item-group-title
      padding-left 12px
      line-height .52rem
      background-color #f0f0f0
      font-size 13px
      color $darkTextColor
    .item
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
</style>
