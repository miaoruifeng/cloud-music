<template>
  <transition appear name="slide">
    <music-list :title="title" :bg-img="bgImg" :songs="songs"></music-list>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'
import { ERR_OK } from 'api/config.js'
import { getSingerDetail } from 'api/singer'
import { createSong, processSongsUrl, isValidMusic } from 'common/js/song'
import MusicList from 'components/music-list/MusicList'
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
          processSongsUrl(this._nomalizeSong(res.data.list)).then((list) => {
            this.songs = list
          })
        }
      })
    },
    _nomalizeSong (list) {
      let ret = []
      list.forEach((item) => {
        let { musicData } = item
        if (isValidMusic(musicData)) {
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
