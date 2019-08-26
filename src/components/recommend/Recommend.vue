<template>
  <div class="recommend">
    <div v-if="slider.length" class="slider-wrapper">
      <slider>
        <div v-for="(item, index) of slider" :key="index">
          <img :src="item.picUrl" />
        </div>
      </slider>
    </div>
  </div>
</template>

<script>
import Slider from 'base/slider/Slider'
import { getSliderList } from 'api/recommend'
export default {
  name: 'Recommend',
  components: {
    Slider
  },
  data () {
    return {
      slider: []
    }
  },
  methods: {
    _getSliderList () {
      getSliderList().then((res) => {
        // console.log(res)
        this.slider = res.data.data
      })
    }
  },
  created () {
    this._getSliderList()
  }
}
</script>

<style lang="stylus" scoped></style>
