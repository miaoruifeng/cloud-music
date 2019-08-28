<template>
  <scroll class="listview" :data="list">
    <ul>
      <li class="item-group" v-for="(group, index) of list" :key="index">
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
    }
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
