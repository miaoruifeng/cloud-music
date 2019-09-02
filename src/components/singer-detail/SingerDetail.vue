<template>
  <transition name="slide">
    <div class="singer-detail">singer-detail</div>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'
import { getSingerDetail } from 'api/singer'
import { createSong } from 'common/js/song'
export default {
  name: 'SingerDetail',
  data () {
    return {
      songs: []
    }
  },
  computed: {
    ...mapGetters([
      'singer'
    ])
  },
  methods: {
    _getSingerDetail () {
      if (!this.singer.id) {
        this.$router.push('/singer')
      }
      getSingerDetail(this.singer.id).then((res) => {
        this.songs = this._nomalizeSong(res.data.list)
        console.log(this.songs)
      })
    },
    _nomalizeSong (list) {
      let ret = []
      list.forEach((item) => {
        let { musicData } = item
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    }
  },
  created () {
    this._getSingerDetail()
  }
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
