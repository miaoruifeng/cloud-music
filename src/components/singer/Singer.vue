<template>
  <div>Singer</div>
</template>

<script>
import { getSingerList, getHotSingerList } from 'api/singer'
export default {
  name: 'Singer',
  data () {
    return {
      singers: []
    }
  },
  methods: {
    _getSingerList () {
      getSingerList().then((res) => {
        console.log('歌手列表：')
        console.log(res)
      })
    },
    _getHotSingerList () {
      getHotSingerList().then((res) => {
        console.log('热门歌手：')
        console.log(res)
      })
    }
  },
  created () {
    this._getSingerList()
    this._getHotSingerList()
  }
}
</script>

<style lang="stylus" scoped></style>
