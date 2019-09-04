<template>
  <transition name="slide">
    <music-list :title="title" :bg-img="bgImg" :songs="songs"></music-list>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'
import { getSingerDetail } from 'api/singer'
import { createSong } from 'common/js/song'
import MusicList from 'components/music-list/MusicList'
import { ERR_OK } from 'api/config.js'
export default {
  name: 'SingerDetail',
  components: {
    MusicList
  },
  data () {
    return {
      songs: []
    }
  },
  computed: {
    title () {
      return this.singer.name
    },
    bgImg () {
      return this.singer.avatar
    },
    ...mapGetters([
      'singer'
    ])
  },
  methods: {
    _getSingerDetail () {
      if (!this.singer.id) {
        this.$router.push('/singer')
        return
      }
      getSingerDetail(this.singer.id).then((res) => {
        if (res.code === ERR_OK) {
          this.songs = this._nomalizeSong(res.data.list)
        }
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
    transition all 0.3s
  .slide-enter, .slide-leave-to
    transform translate3d(100%, 0, 0)
</style>
