// 本地存储管理

const HISTORY_KEY = 'calc_history'
const MAX_HISTORY = 50

// 获取历史记录
function getHistory() {
  try {
    return wx.getStorageSync(HISTORY_KEY) || []
  } catch (e) {
    console.error('读取历史记录失败', e)
    return []
  }
}

// 保存记录
function saveRecord(record) {
  try {
    const history = getHistory()
    
    // 添加记录
    const newRecord = {
      id: Date.now(),
      createTime: formatDate(new Date()),
      ...record
    }
    
    history.unshift(newRecord)
    
    // 限制数量
    if (history.length > MAX_HISTORY) {
      history.pop()
    }
    
    wx.setStorageSync(HISTORY_KEY, history)
    return newRecord
  } catch (e) {
    console.error('保存记录失败', e)
    return null
  }
}

// 删除记录
function deleteRecord(id) {
  try {
    const history = getHistory()
    const index = history.findIndex(item => item.id === id)
    if (index > -1) {
      history.splice(index, 1)
      wx.setStorageSync(HISTORY_KEY, history)
    }
    return true
  } catch (e) {
    console.error('删除记录失败', e)
    return false
  }
}

// 清空历史
function clearHistory() {
  try {
    wx.removeStorageSync(HISTORY_KEY)
    return true
  } catch (e) {
    console.error('清空历史失败', e)
    return false
  }
}

// 格式化日期
function formatDate(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const h = String(date.getHours()).padStart(2, '0')
  const min = String(date.getMinutes()).padStart(2, '0')
  return `${y}-${m}-${d} ${h}:${min}`
}

module.exports = {
  getHistory,
  saveRecord,
  deleteRecord,
  clearHistory
}