<template>
  <transition name="slide">
    <div class="singer-detail">singer-detail</div>
  </transition>
</template>

<script>
export default {
  name: 'SingerDetail'
}
</script>

<style lang="stylus" scoped>
  @import '~stylus/variable.styl'
  .slide-enter-active, .slide-leave-active
    transition all .3s
  .slide-enter, .slide-leave-to
    transform translate3d(100%, 0, 0)
  .singer-detail
    position fixed
    top 0
    left 0
    right 0
    bottom 0
    z-index 100
    background-color $bgColor
</style>
