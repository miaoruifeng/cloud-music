<template>
  <div class="song-list">
    <ul>
      <li
        class="item"
        v-for="(song, index) of songs"
        :key="index"
        @click="selectItem(song, index)"
      >
        <div class="rank" v-if="rank">
          <span :class="getRankClass(index)">{{getRankText(index)}}</span>
        </div>
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
    },
    rank: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    getDesc (song) {
      return `${song.singer}·${song.album}`
    },
    selectItem (item, index) {
      this.$emit('select', item, index)
    },
    getRankClass (index) {
      if (index <= 2) {
        return `icon icon${index + 1}`
      } else {
        return 'text'
      }
    },
    getRankText (index) {
      if (index > 2) {
        return index + 1
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import '~stylus/variable.styl'
  @import '~stylus/mixin.styl'
  .song-list
    .item
      overflow hidden
      display flex
      align-items center
      box-sizing border-box
      padding .20rem 0
      .rank
        flex: 0 0 25px
        width: 25px
        margin-right: 20px
        text-align: center
        .icon
          display: inline-block
          width: 25px
          height: 25px
          background-size: 25px 24px
          &.icon1
            bg-image('first')
          &.icon2
            bg-image('second')
          &.icon3
            bg-image('third')
        .text
          color: $themeColor
          font-size: $font-18
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
