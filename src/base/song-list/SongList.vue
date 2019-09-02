<template>
  <div class="song-list">
    <ul>
      <li class="item border-bottom" v-for="(song, index) of songs" :key="index">
        <div class="item-content">
          <h2 class="item-name">{{song.name}}</h2>
          <p class="item-desc">{{getDesc(song)}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'SongList',
  props: {
    songs: {
      type: Array,
      default: null
    }
  },
  methods: {
    getDesc (song) {
      return `${song.singer}·${song.album}`
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import '~stylus/variable.styl'
  @import '~stylus/mixin.styl'
  .border-bottom
    &:before
      border-color #ccc
  .song-list
    .item
      overflow hidden
      display flex
      align-items center
      box-sizing border-box
      padding .14rem 12px
      .item-content
        overflow hidden
        flex 1
        line-height .44rem
        .item-name
          font-size 15px
          color $darkTextColor
          ellipsis()
        .item-desc
          font-size 12px
          color $lightTextColor
          ellipsis()
</style>
