import axios from './axios.js'

export function getSliderList () {
  return axios.get('/banner')
}
