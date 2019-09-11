<template>
  <div class="search-list" v-show="searches.length">
    <transition-group tag="ul" name="list">
      <li class="item" v-for="item of searches" :key="item" @click="selectItem(item)">
        <span class="text">{{item}}</span>
        <span class="icon" @click.stop="deleteOne(item)">
          <i class="icon-delete"></i>
        </span>
      </li>
    </transition-group>
  </div>
</template>

<script>
export default {
  name: 'SearchList',
  props: {
    searches: {
      type: Array,
      default: null
    }
  },
  methods: {
    selectItem (item) {
      this.$emit('select', item)
    },
    deleteOne (item) {
      this.$emit('delete', item)
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import '~stylus/variable.styl'
  @import '~stylus/mixin.styl'
  .search-list
    .item
      overflow: hidden
      display: flex
      align-items: center
      height: 40px
      font-size: $font-14
      color: $textColorG
      &.list-enter-active, &.list-leave-active
        transition: all 0.1s
      &.list-enter, &.list-leave-to
        height: 0
      .text
        flex: 1
      .icon
        extend-click()
        .icon-delete
          font-size: $font-12
      color: $textColorG
</style>
