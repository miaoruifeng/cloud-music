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
    height 40px
    line-height 40px
    background-color $themeColor
    color #fff
    font-size 16px
    text-align center
</style>
