<template>
  <div class="song-list">
    <ul>
      <li
        class="item border-bottom"
        v-for="(song, index) of songs"
        :key="index"
        @click="selectItem(song, index)"
      >
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
    },
    selectItem (item, index) {
      this.$emit('select', item, index)
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import '~stylus/variable.styl'
  @import '~stylus/mixin.styl'
  .border-bottom
    &:before
      border-color $bgDialogColor
  .song-list
    .item
      overflow hidden
      display flex
      align-items center
      box-sizing border-box
      padding .20rem .40rem
      .item-content
        overflow hidden
        flex 1
        line-height .48rem
        .item-name
          font-size $font-14
          color $textColorL
          ellipsis()
        .item-desc
          font-size $font-12
          color $textColorG
          ellipsis()
</style>
