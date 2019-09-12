import storage from 'good-storage'
const SEARCH_KEY = '_search_'
const SEARCH_MAX_LENGTH = 15

// 往数组中添加query相关操作
function insertArray (arr, val, compare, maxLen) {
  const index = arr.findIndex(compare)
  if (index === 0) {
    return
  }
  if (index > 0) {
    arr.splice(index, 1)
  }
  arr.unshift(val)
  // 是否超过限制的长度
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}

// 数组中删除相关
function deleteFromArray (arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

// 保存搜索历史
export function saveSearch (query) {
  let searches = storage.get(SEARCH_KEY, [])
  insertArray(searches, query, (item) => {
    return item === query
  }, SEARCH_MAX_LENGTH)
  storage.set(SEARCH_KEY, searches)
  return searches
}

// 删除一条搜索历史
export function deleteSearch (query) {
  let searches = storage.get(SEARCH_KEY, [])
  deleteFromArray(searches, (item) => {
    return item === query
  })
  storage.set(SEARCH_KEY, searches)
  return searches
}

// 清空搜索历史
export function clearSearch () {
  storage.remove(SEARCH_KEY)
  return []
}

// 获取搜索历史 -- state从本地存储获取
export function getSearch () {
  return storage.get(SEARCH_KEY, [])
}