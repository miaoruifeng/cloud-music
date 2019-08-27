import axios from './axios.js'

export function getSingerList () {
  return axios.get('/artist/list')
}

export function getHotSingerList () {
  return axios.get('/artist/top')
}
