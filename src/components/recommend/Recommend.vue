<template>
  <div class="recommend">
    <div class="recommend-content" ref="wrapper">
      <div>
        <slider v-if="slider.length">
          <div v-for="(item, index) of slider" :key="index">
            <img :src="item.picUrl" />
          </div>
        </slider>
        <hot-list :list="hotList"></hot-list>
      </div>
    </div>
  </div>
</template>

<script>
import Slider from 'base/slider/Slider'
import HotList from 'components/hotList/hotList'
import BScroll from 'better-scroll'
import { getSliderList, getHotSongList } from 'api/recommend'
export default {
  name: 'Recommend',
  components: {
    Slider,
    HotList
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
        console.log(res)
        this.hotList = res.data.data
      })
    }
  },
  created () {
    this._getSliderList()
    this._getHotSongList()
  },
  mounted () {
    this.scroll = new BScroll(this.$refs.wrapper)
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
