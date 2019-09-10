<template>
  <transition appear name="slide">
    <div class="top-list">
      <music-list :title="title" :bg-img="bgImg" :songs="songList" :rank="rank"></music-list>
    </div>
  </transition>
</template>

<script>
import MusicList from 'components/music-list/MusicList'
import { mapGetters } from 'vuex'
import { getMusicList } from 'api/rank'
import { ERR_OK } from 'api/config.js'
import { createSong, processSongsUrl, isValidMusic } from 'common/js/song.js'
export default {
  name: 'TopList',
  components: {
    MusicList
  },
  data () {
    return {
      songList: [],
      rank: true
    }
  },
  computed: {
    title () {
      return this.topList.topTitle
    },
    bgImg () {
      return this.topList.picUrl
    },
    ...mapGetters([
      'topList'
    ])
  },
  methods: {
    _getMusicList () {
      if (!this.topList.id) {
        this.$router.push('/rank')
        return
      }
      getMusicList(this.topList.id).then(res => {
        if (res.code === ERR_OK) {
          processSongsUrl(this._normalizeSongs(res.songlist)).then((list) => {
            this.songList = list
          })
        }
      })
    },
    _normalizeSongs (list) {
      let ret = []
      list.forEach(item => {
        let musicData = item.data
        if (isValidMusic(musicData)) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    }
  },
  created () {
    this._getMusicList()
  }
}
</script>

<style lang="stylus" scoped>
  @import '~stylus/variable.styl'
  .slide-enter-active, .slide-leave-active
    transition all 0.3s
  .slide-enter, .slide-leave-to
    transform translate3d(100%, 0, 0)
  .top-list
    z-index 100
    position fixed
    top 0
    left 0
    bottom 0
    right 0
    background-color $bgColor
</style>
