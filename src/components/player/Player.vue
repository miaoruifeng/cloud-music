<template>
  <div class="player" v-show="playList.length > 0">
    <div class="mormal-player" v-show="fullScreen">播放器</div>
    <div class="mini-player" v-show="!fullScreen"></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Player',
  computed: {
    ...mapGetters([
      'fullScreen',
      'playList'
    ])
  },
  methods: {

  }
}
</script>

<style lang="stylus" scoped>
  .player
    .mormal-player
      z-index 200
      position fixed
      top 0
      left 0
      bottom 0
      right 0
      background-color #ccc
</style>
