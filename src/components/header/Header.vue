<template>
  <div class="header">
    <h1 class="text">Cloud Music</h1>
    <router-link tag="span" to="/user" class="mine">
      <i class="icon-mine"></i>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'MHeader'
}
</script>

<style lang="stylus" scoped>
  @import '~stylus/variable.styl'
  .header
    position relative
    height 44px
    line-height 44px
    background-color $bgColor
    color $themeColor
    font-size $font-18
    text-align center
    .text
      width 80%
      margin 0 auto
    .mine
      position absolute
      top 0
      right 8px
      width 30px
</style>
