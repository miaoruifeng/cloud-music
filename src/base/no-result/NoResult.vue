<template>
  <div class="no-result">
    <p class="no-result-text">{{text}}</p>
  </div>
</template>

<script>
export default {
  name: 'NoResult',
  props: {
    text: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import '~stylus/variable.styl'
  .no-result
    text-align center
    .no-result-text
      font-size $font-14
      color $textColorD
</style>
