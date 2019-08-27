<template>
  <div class="recommend">
    <scroll class="recommend-content" ref="scroll" :data="hotList">
      <div>
        <slider v-if="slider.length">
          <div v-for="(item, index) of slider" :key="index">
            <img @load="loadImg" :src="item.picUrl" />
          </div>
        </slider>
        <hot-list :list="hotList"></hot-list>
      </div>
    </scroll>
  </div>
</template>

<script>
import Slider from 'base/slider/Slider'
import HotList from 'components/hotList/HotList'
import Scroll from 'base/scroll/Scroll'
import { getSliderList, getHotSongList } from 'api/recommend'
export default {
  name: 'Recommend',
  components: {
    Slider,
    HotList,
    Scroll
  },
  data () {
    return {
      slider: [],
      hotList: []
    }
  },
  methods: {
    _getSliderList () {
      getSliderList().then((res) => {
        this.slider = res.data.data
      })
    },
    _getHotSongList () {
      getHotSongList().then((res) => {
        this.hotList = res.data.data
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
    top 80px
    bottom 0
    width 100%
    .recommend-content
      overflow hidden
      height 100%
</style>
