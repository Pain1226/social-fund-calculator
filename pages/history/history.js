const { getHistory, deleteRecord, clearHistory } = require('../../utils/storage')

Page({
  data: {
    history: []
  },
  
  onShow() {
    this.loadHistory()
  },
  
  loadHistory() {
    const history = getHistory()
    this.setData({ history })
  },
  
  deleteItem(e) {
    const id = e.currentTarget.dataset.id
    
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条记录吗？',
      success: (res) => {
        if (res.confirm) {
          deleteRecord(id)
          this.loadHistory()
          wx.showToast({ title: '已删除', icon: 'success' })
        }
      }
    })
  },
  
  clearAll() {
    wx.showModal({
      title: '确认清空',
      content: '确定要清空所有历史记录吗？此操作不可恢复。',
      success: (res) => {
        if (res.confirm) {
          clearHistory()
          this.setData({ history: [] })
          wx.showToast({ title: '已清空', icon: 'success' })
        }
      }
    })
  },
  
  goBack() {
    wx.navigateBack()
  }
})