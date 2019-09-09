<template>
  <div class="recommend" ref="recommend">
    <scroll class="recommend-content" ref="scroll" :data="discList">
      <div>
        <slider v-if="slider.length">
          <div v-for="item of slider" :key="item.id">
            <a :href="item.linkUrl">
              <img @load="loadImg" :src="item.picUrl">
            </a>
          </div>
        </slider>
        <disc-list :list="discList" @select="selectDisc"></disc-list>
      </div>
      <div class="loading-container" v-if="showLoading">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import { ERR_OK } from 'api/config'
import { getSliderList, getDiscList } from 'api/recommend'
import Scroll from 'base/scroll/Scroll'
import Slider from 'base/slider/Slider'
import Loading from 'base/loading/Loading'
import DiscList from 'components/disc-list/DiscList'
import { playListMixin } from 'common/js/mixin'
import { mapMutations } from 'vuex'
export default {
  name: 'Recommend',
  components: {
    Slider,
    DiscList,
    Scroll,
    Loading
  },
  mixins: [playListMixin],
  data () {
    return {
      slider: [],
      discList: []
    }
  },
  computed: {
    showLoading () {
      return !this.discList.length
    }
  },
  methods: {
    handlePlayList (playList) {
      const bottom = playList.length > 0 ? '60px' : ''
      this.$refs.recommend.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    selectDisc (item) {
      this.$router.push({
        path: `/recommend/${item.dissid}`
      })
      this.setDisc(item)
    },
    _getSliderList () {
      getSliderList().then((res) => {
        if (res.code === ERR_OK) {
          this.slider = res.data.slider
        }
      })
    },
    _getDiscList () {
      getDiscList().then((res) => {
        if (res.code === ERR_OK) {
          this.discList = res.data.list
        }
      })
    },
    loadImg () {
      if (!this.checkloaded) {
        this.checkloaded = true
        this.$refs.scroll.refresh()
      }
    },
    ...mapMutations({
      'setDisc': 'SET_DISC'
    })
  },
  created () {
    this._getSliderList()
    this._getDiscList()
  }
}
</script>

<style lang="stylus" scoped>
  .recommend
    overflow hidden
    position fixed
    top 88px
    bottom 0
    width 100%
    .recommend-content
      overflow hidden
      height 100%
      .loading-container
        position absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
