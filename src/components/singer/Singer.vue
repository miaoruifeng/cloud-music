<template>
  <div class="singer" ref="singer">
    <list-view :list="singers" @select="selectSinger" ref="singerList"></list-view>
    <router-view></router-view>
    <div class="loading-container" v-if="!singers.length">
      <loading></loading>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { ERR_OK } from 'api/config.js'
import { getSingerList } from 'api/singer'
import Singer from 'common/js/singer'
import ListView from 'base/listview/ListView'
import Loading from 'base/loading/Loading'
import { playListMixin } from 'common/js/mixin'

const HOT_NAME = '热门'
const HOT_SINGER_LEN = 10

export default {
  name: 'Singer',
  components: {
    ListView,
    Loading
  },
  mixins: [playListMixin],
  data () {
    return {
      singers: []
    }
  },
  methods: {
    handlePlayList (playList) {
      const bottom = playList.length > 0 ? '60px' : ''
      this.$refs.singer.style.bottom = bottom
      this.$refs.singerList.refresh()
    },
    _getSingerList () {
      getSingerList().then((res) => {
        if (res.code === ERR_OK) {
          this.singers = this._nomalizeSinger(res.data.list)
        }
      })
    },
    // 数据处理
    _nomalizeSinger (list) {
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      }
      list.forEach((item, index) => {
        if (index < HOT_SINGER_LEN) {
          map.hot.items.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          }))
        }
        item.Findex = item.Findex === '9' ? '#' : item.Findex
        const key = item.Findex
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }
        map[key].items.push(new Singer({
          id: item.Fsinger_mid,
          name: item.Fsinger_name
        }))
      })
      // console.log(map)
      // 处理map 得到有序列表
      let hot = []
      let ret = []
      let els = []
      for (let key in map) {
        let val = map[key]
        if (val.title.match(/[a-zA-Z]/)) {
          ret.push(val)
        } else if (val.title === HOT_NAME) {
          hot.push(val)
        } else {
          els.push(val)
        }
      }
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      return hot.concat(ret, els)
    },
    selectSinger (singer) {
      this.$router.push({
        path: `/singer/${singer.id}`
      })
      this.setSinger(singer)
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    })
  },
  created () {
    this._getSingerList()
  }
}
</script>

<style lang="stylus" scoped>
  .singer
    overflow hidden
    position fixed
    top 88px
    bottom 0
    width 100%
</style>
