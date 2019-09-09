<template>
  <transition appear name="slide">
    <div class="disc-detail">
      <music-list :title="title" :bg-img="bgImg" :songs="songs"></music-list>
    </div>
  </transition>
</template>

<script>
import MusicList from 'components/music-list/MusicList'
import { mapGetters } from 'vuex'
import { getSongList } from 'api/recommend'
import { ERR_OK } from 'api/config.js'
import { createSong, processSongsUrl, isValidMusic } from 'common/js/song.js'
export default {
  name: 'DiscDetail',
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
      return this.disc.dissname
    },
    bgImg () {
      return this.disc.imgurl
    },
    ...mapGetters([
      'disc'
    ])
  },
  methods: {
    _getSongList () {
      if (!this.disc.dissid) {
        this.$router.push('/recommend')
        return
      }
      getSongList(this.disc.dissid).then(res => {
        if (res.code === ERR_OK) {
          // console.log(res.cdlist[0].songlist)
          processSongsUrl(this._normalizeSongs(res.cdlist[0].songlist)).then((list) => {
            this.songs = list
          })
        }
      })
    },
    _normalizeSongs (list) {
      let ret = []
      list.forEach(musicData => {
        if (isValidMusic(musicData)) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    }
  },
  created () {
    this._getSongList()
  }
}
</script>

<style lang="stylus" scoped>
  @import '~stylus/variable.styl'
  .slide-enter-active, .slide-leave-active
    transition all 0.3s
  .slide-enter, .slide-leave-to
    transform translate3d(100%, 0, 0)
  .disc-detail
    z-index 100
    position fixed
    top 0
    left 0
    bottom 0
    right 0
    background-color $bgColor
</style>
