<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input class="box" :placeholder="placeholder" v-model="query" />
    <i class="icon-dismiss" v-show="query" @click="clear"></i>
  </div>
</template>

<script>
export default {
  name: 'SearchBox',
  props: {
    placeholder: {
      type: String,
      default: '搜索歌曲、歌手'
    }
  },
  data () {
    return {
      query: ''
    }
  },
  methods: {
    setQuery (query) {
      this.query = query
    },
    clear () {
      this.query = ''
    }
  },
  created () {
    this.$watch('query', (newQuery) => {
      this.$emit('query', newQuery)
    })
  }
}
</script>

<style lang="stylus" scoped>
  @import '~stylus/variable.styl'
  .search-box
    display: flex
    align-items: center
    width: 100%
    height: 40px
    padding: 0 6px
    box-sizing: border-box
    border-radius: 6px
    background: $bgHLColor
    .icon-search
      font-size: 24px
      color: $darkThemeColor
    .icon-dismiss
      font-size: 16px
      color: $darkThemeColor
    .box
      flex: 1
      margin: 0 5px
      outline: 0
      line-height: 18px
      background: $bgHLColor
      color: $textColorL
      font-size: $font-14
      &::placeholder
        color: $textColorD
</style>
