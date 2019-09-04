<template>
  <div class="header">Cloud Music</div>
</template>

<script>
export default {
  name: 'MHeader'
}
</script>

<style lang="stylus" scoped>
  @import '~stylus/variable.styl'
  .header
    height 44px
    line-height 44px
    background-color $bgColor
    color $themeColor
    font-size $font-18
    text-align center
</style>
