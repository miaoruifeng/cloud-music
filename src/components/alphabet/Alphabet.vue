<template>
  <div
    class="shortcut-list"
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
      >
      {{item}}
      </li>
    </ul>
  </div>
</template>

<script>
import { getData } from 'common/js/dom'

const ANCHOR_HEIGHT = 20
export default {
  name: 'Alphabet',
  props: {
    list: {
      type: Array,
      default: null
    }
  },
  computed: {
    shortcutList () {
      return this.list.map((group) => {
        return group.title.substr(0, 1)
      })
    }
  },
  methods: {
    onShortcutTouchStart (e) {
      let anchorIndex = getData(e.target, 'index')
      let firstTouch = e.touches[0]
      this.touch.y1 = firstTouch.pageY
      this.touch.anchorIndex = anchorIndex
      this.$emit('change', anchorIndex)
    },
    onShortcutTouchMove (e) {
      let firstTouch = e.touches[0]
      this.touch.y2 = firstTouch.pageY
      let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
      let anchorIndex = parseInt(this.touch.anchorIndex) + delta
      this.$emit('change', anchorIndex)
    }
  },
  created () {
    this.touch = {}
  }
}
</script>

<style lang="stylus" scoped>
  .shortcut-list
    display flex
    flex-direction column
    justify-content center
    position fixed
    top 84px
    bottom 0
    right 0
    width 20px
    .item
      line-height 20px
      font-size 10px
      color #666
      text-align center
</style>
