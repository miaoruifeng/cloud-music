<template>
  <div class="singer">
    <list-view :list="singers" :anchorIndex="anchorIndex"></list-view>
    <alphabet :list="singers" @change="omChangeTouch"></alphabet>
  </div>
</template>

<script>
import { getSingerList } from 'api/singer'
import Singer from 'common/js/singer'
import ListView from 'base/listview/ListView'
import Alphabet from 'components/alphabet/Alphabet'

const HOT_NAME = '热门'
const HOT_SINGER_LEN = 10

export default {
  name: 'Singer',
  components: {
    ListView,
    Alphabet
  },
  data () {
    return {
      singers: [],
      anchorIndex: null
    }
  },
  methods: {
    _getSingerList () {
      getSingerList().then((res) => {
        // console.log(this._nomalizeSinger(res.data.list))
        this.singers = this._nomalizeSinger(res.data.list)
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
    omChangeTouch (index) {
      this.anchorIndex = index
    }
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
    top 84px
    bottom 0
    width 100%
</style>
