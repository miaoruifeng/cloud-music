import axios from './axios.js'

export function getSliderList () {
  return axios.get('/banner')
}

export function getHotSongList () {
  return axios.get('/top/playlist')
}
