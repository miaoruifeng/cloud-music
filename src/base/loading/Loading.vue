<template>
  <div class="loading">
    <img class="loading-img" src="@/common/images/loading.gif" />
    <p class="desc">{{title}}</p>
  </div>
</template>

<script>
export default {
  name: 'Loading',
  props: {
    title: {
      type: String,
      default: '正在载入...'
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import '~stylus/variable.styl'
  .loading
    width 100%
    text-align center
    .loading-img
      width .48rem
      height .48rem
    .desc
      line-height 0.7rem
      font-size $font-12
      color $textColorGL
</style>
