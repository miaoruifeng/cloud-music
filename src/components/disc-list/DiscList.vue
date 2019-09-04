<template>
  <div class="disc-list">
    <h1 class="list-title">热门歌单推荐</h1>
    <ul>
      <li class="item" v-for="item of list" :key="item.dissid">
        <img class="item-img" v-lazy="item.imgurl" />
        <div class="item-text">
          <h2 class="item-name">{{item.dissname}}</h2>
          <p class="item-disc">{{item.creator.name}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'DiscList',
  props: {
    list: Array
  }
}
</script>

<style lang="stylus" scoped>
  @import '~stylus/variable.styl'
  @import '~stylus/mixin.styl'
  .disc-list
    padding 0 12px
    .list-title
      height 1.0rem
      line-height 1.2rem
      font-size $font-14
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
        padding 0.2rem 0.3rem 0.2rem 0
      .item-text
        flex 1
        padding 0.20rem 0
        line-height: 0.58rem
        min-width 0
        .item-name
          font-size $font-14
          color $textColorL
          ellipsis()
        .item-disc
          font-size $font-12
          color $textColorG
          ellipsis()
</style>
