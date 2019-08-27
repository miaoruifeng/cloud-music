<template>
  <div class="tab">
    <router-link tag="div" class="tab-item" to="/recommend">
      <span class="tab-link">推荐</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/singer">
      <span class="tab-link">歌手</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/rank">
      <span class="tab-link">排行</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/search">
      <span class="tab-link">搜索</span>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'Tab'
}
</script>

<style lang="stylus" scoped>
  @import '~stylus/variable.styl'
  .tab
    display flex
    height 40px
    line-height 40px
    // background-color #f2f2f2
    font-size 14px
    .tab-item
      flex 1
      text-align center
      .tab-link
        padding 0 3px 5px 3px
        color $darkTextColor
      &.router-link-active
        .tab-link
          color $themeColor
          border-bottom: 2px solid $themeColor
</style>
