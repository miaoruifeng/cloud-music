import axios from './axios.js'

export function getSingerList () {
  return axios.get('/artist/list')
}

export function getHotSingerList () {
  return axios.get('/top/artists')
}

// import jsonp from 'common/js/jsonp'
// import { commonParams, options } from './config'

// export function getSingerList () {
//   const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'
//   const data = Object.assign({}, commonParams, {
//     channel: 'singer',
//     page: 'list',
//     key: 'all_all_all',
//     pagesize: 100,
//     pagenum: 1,
//     hostUin: 0,
//     needNewCode: 0,
//     platform: 'yqq'
//   })
//   return jsonp(url, data, options)
// }
