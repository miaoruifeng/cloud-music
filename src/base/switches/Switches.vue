<template>
  <ul class="switches">
    <li
      class="switch-item"
      v-for="(item, index) in switches"
      :key="index"
      :class="{'active': currentIndex === index}"
      @click="switchItem(index)"
    >
      <span>{{item.name}}</span>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'Switches',
  props: {
    switches: {
      type: Array,
      default: null
    },
    currentIndex: {
      type: Number,
      default: 0
    }
  },
  methods: {
    switchItem (index) {
      this.$emit('switch', index)
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import '~stylus/variable.styl'
  .switches
    display: flex
    align-items: center
    margin: 0 auto
    width: 240px
    border: 1px solid $bgHLColor
    border-radius: 5px
    .switch-item
      flex: 1
      padding: 8px
      text-align: center
      font-size: $font-14
      color: $textColorG
      &.active
        background: $bgHLColor
        color: $textColorL
</style>
