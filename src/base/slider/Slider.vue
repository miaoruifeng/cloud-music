<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <span
        class="dot"
        v-for="(item, index) of dots"
        :key="index"
        :class="{active: currentPageIndex === index}"
      ></span>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import { addClass } from 'common/js/dom.js'
export default {
  name: 'Slider',
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 4000
    }
  },
  data () {
    return {
      dots: [],
      currentPageIndex: 0
    }
  },
  methods: {
    // 设置slider宽度
    _setSliderWidth (isResize) {
      this.children = this.$refs.sliderGroup.children
      let width = 0
      let sliderWidth = this.$refs.slider.clientWidth
      for (let i = 0; i < this.children.length; i++) {
        let child = this.children[i]
        addClass(child, 'slider-item')
        child.style.width = sliderWidth + 'px'
        width += sliderWidth
      }
      if (this.loop && !isResize) {
        width += 2 * sliderWidth
      }
      this.$refs.sliderGroup.style.width = width + 'px'
    },
    // 初始化slider
    _initSlider () {
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: true,
        snapLoop: this.loop,
        snapThreshold: 0.3,
        snapSpeed: 400,
        click: true
      })
      this.slider.on('scrollEnd', () => {
        let pageIndex = this.slider.getCurrentPage().pageX
        if (this.loop) {
          pageIndex -= 1
        }
        this.currentPageIndex = pageIndex

        if (this.autoPlay) {
          clearTimeout(this.timer)
          this._autoPlay()
        }
      })
    },
    // 初始化dots
    _initDots () {
      this.dots = new Array(this.children.length)
    },
    // 设置自动轮播
    _autoPlay () {
      let pageIndex = this.currentPageIndex + 1
      if (this.loop) {
        pageIndex += 1
      }
      this.timer = setTimeout(() => {
        this.slider.goToPage(pageIndex, 0, 400)
      }, this.interval)
    }
  },
  mounted () {
    setTimeout(() => {
      this._setSliderWidth()
      this._initDots()
      this._initSlider()
      if (this.autoPlay) {
        this._autoPlay()
      }
    }, 20)
    window.addEventListener('resize', () => {
      if (!this.slider) {
        return
      }
      this._setSliderWidth(true)
      this.slider.refresh()
    })
  },
  beforeDestroy () {
    clearTimeout(this.timer)
  },
  activated () {
    if (this.autoPlay) {
      this._autoPlay()
    }
  },
  deactivated () {
    clearTimeout(this.timer)
  }
}
</script>

<style lang="stylus" scoped>
  @import '~stylus/variable.styl'
  .slider
    position relative
    min-height 1px
    .slider-group
      overflow: hidden
      height 0
      padding-bottom 46.02%
      .slider-item
        float left
        box-sizing border-box
        img
          width 100%
    .dots
      position absolute
      left 0
      right 0
      bottom 12px
      text-align center
      .dot
        display inline-block
        width 8px
        height 8px
        margin 0 0.08rem
        border-radius 50%
        background-color #fff
        &.active
          // width 18px
          // border-radius 8px
          background-color $themeColor
</style>
