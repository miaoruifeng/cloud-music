import { mapGetters } from 'vuex'

export const playListMixin = {
  computed: {
    ...mapGetters([
      'playList'
    ])
  },
  watch: {
    playList (newVal) {
      this.handlePlayList(newVal)
    }
  },
  methods: {
    handlePlayList () {
      throw new Error('component must implement handlePlayList method')
    }
  },
  mounted () {
    this.handlePlayList(this.playList)
  },
  activated () {
    this.handlePlayList(this.playList)
  }
}
