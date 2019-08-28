<template>
  <div class="recommend">
    <scroll class="recommend-content" ref="scroll" :data="hotList">
      <div>
        <slider v-if="slider.length">
          <div v-for="(item, index) of slider" :key="index">
            <img @load="loadImg" :src="item.imageUrl" />
          </div>
        </slider>
        <hot-list :list="hotList"></hot-list>
      </div>
      <div class="loading-container" v-if="showLoading">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script>
import { getSliderList, getHotSongList } from 'api/recommend'
import Scroll from 'base/scroll/Scroll'
import Slider from 'base/slider/Slider'
import HotList from 'components/hotList/HotList'
import Loading from 'base/loading/Loading'
export default {
  name: 'Recommend',
  components: {
    Slider,
    HotList,
    Scroll,
    Loading
  },
  data () {
    return {
      slider: [],
      hotList: []
    }
  },
  computed: {
    showLoading () {
      return !this.hotList.length
    }
  },
  methods: {
    _getSliderList () {
      getSliderList().then((res) => {
        this.slider = res.data.banners
      })
    },
    _getHotSongList () {
      getHotSongList().then((res) => {
        this.hotList = res.data.playlists
      })
    },
    loadImg () {
      if (!this.checkloaded) {
        this.checkloaded = true
        this.$refs.scroll.refresh()
      }
    }
  },
  created () {
    this._getSliderList()
    this._getHotSongList()
  }
}
</script>

<style lang="stylus" scoped>
  .recommend
    overflow hidden
    position fixed
    top 84px
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
