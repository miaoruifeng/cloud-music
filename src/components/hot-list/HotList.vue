<template>
  <div class="hot-list">
    <h1 class="list-title">热门歌单推荐</h1>
    <ul>
      <li class="item border-bottom" v-for="item of list" :key="item.id">
        <img class="item-img" v-lazy="item.coverImgUrl" />
        <div class="item-text">
          <h2 class="item-name">{{item.name}}</h2>
          <p class="item-disc">{{item.description}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'HotList',
  props: {
    list: Array
  }
}
</script>

<style lang="stylus" scoped>
  @import '~stylus/variable.styl'
  @import '~stylus/mixin.styl'
  .border-bottom
    &:before
      border-color #ccc
  .hot-list
    padding 0 12px
    .list-title
      height 1.0rem
      line-height 1.2rem
      font-size 16px
      color $themeColor
      text-align center
    .item
      overflow hidden
      display flex
      align-items center
      height 1.6rem
      box-sizing border-box
      .item-img
        display block
        width 1.2rem
        height 1.2rem
        padding 0.20rem
        padding-left 0
      .item-text
        flex 1
        padding 0.20rem 0
        line-height: 0.58rem
        min-width 0
        .item-name
          font-size 15px
          color $darkTextColor
          ellipsis()
        .item-disc
          font-size 12px
          color $lightTextColor
          ellipsis()
</style>
