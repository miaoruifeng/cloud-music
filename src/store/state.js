import { playMode } from 'common/js/config'

const state = {
  singer: {}, // 歌手列表
  // 播放器相关
  playing: false, // 是否播放
  fullScreen: false, // 是否全屏播放
  playList: [], // 当前播放列表
  sequenceList: [], // 顺序播放列表
  mode: playMode.sequence, // 播放模式-顺序、单曲、随机
  currentIndex: -1, // 当前播放歌曲索引
  disc: {},
  topList: {}
}

export default state
