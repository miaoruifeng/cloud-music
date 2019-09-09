import Vue from 'vue'
import Router from 'vue-router'
import Recommend from 'components/recommend/Recommend'
import Singer from 'components/singer/Singer'
import Rank from 'components/rank/Rank'
import Search from 'components/search/Search'
import SingerDetail from 'components/singer-detail/SingerDetail'
import DiscDetail from 'components/disc-detail/DiscDetail'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      name: 'Recommend',
      component: Recommend,
      children: [
        {
          path: ':id',
          name: 'DiscDetail',
          component: DiscDetail
        }
      ]
    },
    {
      path: '/singer',
      name: 'Singer',
      component: Singer,
      children: [
        {
          path: ':id',
          name: 'SingerDetail',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/rank',
      name: 'Rank',
      component: Rank
    },
    {
      path: '/search',
      name: 'Search',
      component: Search
    }
  ]
})
