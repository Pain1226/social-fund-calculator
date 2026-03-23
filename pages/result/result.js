const { saveRecord } = require('../../utils/storage')

Page({
  data: {
    result: null,
    input: null
  },
  
  onLoad() {
    const app = getApp()
    const data = app.globalData.currentResult
    
    if (!data) {
      wx.showToast({ title: '数据加载失败', icon: 'none' })
      setTimeout(() => wx.navigateBack(), 1500)
      return
    }
    
    this.setData({
      result: data,
      input: data.input
    })
  },
  
  saveToHistory() {
    const { result, input } = this.data
    
    const record = {
      actualSalary: input.actualSalary,
      baseSalary: input.baseSalary,
      city: input.city,
      fundRate: input.fundRate,
      diffTotal: result.summary.diffTotal,
      yearlyDiff: result.summary.yearlyDiff
    }
    
    const saved = saveRecord(record)
    
    if (saved) {
      wx.showToast({ title: '保存成功', icon: 'success' })
    } else {
      wx.showToast({ title: '保存失败', icon: 'none' })
    }
  },
  
  goBack() {
    wx.navigateBack()
  }
})