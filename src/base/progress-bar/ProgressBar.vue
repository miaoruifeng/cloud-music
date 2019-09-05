<template>
  <div class="progress-bar" ref="progressBar" @click="handleProgressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div
        class="progress-btn-wrapper"
        ref="progressBtn"
        @touchstart.prevent="progressTouchStart"
        @touchmove.prevent="progressTouchMove"
        @touchend="progressTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { prefixStyle } from 'common/js/dom'

const transform = prefixStyle('transform')
const PROGRESS_BTN_WIDTH = 16
export default {
  name: 'ProgressBar',
  props: {
    percent: Number,
    default: 0
  },
  watch: {
    percent (newPercent) {
      if (newPercent >= 0 && !this.touch.initiated) {
        let barWidth = this.$refs.progressBar.clientWidth - PROGRESS_BTN_WIDTH
        let offsetWidth = newPercent * barWidth
        this._offset(offsetWidth)
      }
    }
  },
  methods: {
    progressTouchStart (e) {
      this.touch.initiated = true
      this.touch.startX = e.touches[0].pageX
      this.touch.left = this.$refs.progress.clientWidth
    },
    progressTouchMove (e) {
      if (!this.touch.initiated) {
        return
      }
      let deltaX = e.touches[0].pageX - this.touch.startX
      let offsetWidth = Math.min(this.$refs.progressBar.clientWidth - PROGRESS_BTN_WIDTH, Math.max(0, this.touch.left + deltaX))
      this._offset(offsetWidth)
    },
    progressTouchEnd () {
      this.touch.initiated = false
      this._trigglePercent()
    },
    handleProgressClick (e) {
      let rect = this.$refs.progressBar.getBoundingClientRect()
      let offset = e.pageX - rect.left
      this._offset(offset)
      this._trigglePercent()
    },
    _trigglePercent () {
      let barWidth = this.$refs.progressBar.clientWidth - PROGRESS_BTN_WIDTH
      let percent = this.$refs.progress.clientWidth / barWidth
      this.$emit('percentChange', percent)
    },
    _offset (offsetWidth) {
      this.$refs.progress.style.width = `${offsetWidth}px`
      this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
    }
  },
  created () {
    this.touch = {}
  }
}
</script>

<style lang="stylus" scoped>
  @import '~stylus/variable.styl'
  .progress-bar
    height: 30px
    line-height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.2)
      .progress
        position: absolute
        left: 0
        top: 0
        height: 100%
        background: $themeColor
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          left: 7px
          top: 7px
          width: 16px
          height: 16px
          box-sizing: border-box
          background: $themeColor
          border: 3px solid $textColorL
          border-radius: 50%
</style>
