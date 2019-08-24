<template>
  <div>
    <slider></slider>
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
        console.log(res)
      })
    }
  },
  created () {
    this._getSliderList()
  }
}
</script>

<style lang="stylus" scoped></style>
