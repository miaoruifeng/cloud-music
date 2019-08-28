<template>
  <div class="shot-list">
    <ul>
      <li
        class="item"
        v-for="(item, index) of shortList"
        :key="index"
      >
      {{item}}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Alphabet',
  props: {
    list: {
      type: Array,
      default: null
    }
  },
  computed: {
    shortList () {
      return this.list.map((group) => {
        return group.title.substr(0, 1)
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
  .shot-list
    display flex
    flex-direction column
    justify-content center
    position fixed
    top 84px
    bottom 0
    right 0
    width 20px
    .item
      line-height 20px
      font-size 10px
      color #666
      text-align center
</style>
