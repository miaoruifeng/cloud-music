// 获取制定数字之间的随机数
export function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

// 打乱数组
export function shuffle (arr) {
  let _arr = arr.concat([])
  for (let i = 0; i < _arr.length; i++) {
    let j = getRandomInt(0, i)
    let temp = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = temp
  }
  return _arr
}

// 函数节流
export function debounce (fn, delay) {
  let timer
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}
