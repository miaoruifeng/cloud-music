<template>
  <div>Recommend</div>
</template>

<script>
import { getSliderList } from 'api/recommend'
export default {
  name: 'Recommend',
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
