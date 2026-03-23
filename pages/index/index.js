const { getCities } = require('../../utils/policy')
const { calculate } = require('../../utils/calculator')

Page({
  data: {
    actualSalary: '',
    baseSalary: '',
    cities: getCities(),
    cityIndex: 0,
    fundRates: [5, 6, 7, 8, 9, 10, 11, 12],
    fundRateIndex: 5 // 默认12%
  },
  
  onActualSalaryInput(e) {
    this.setData({ actualSalary: e.detail.value })
  },
  
  onBaseSalaryInput(e) {
    this.setData({ baseSalary: e.detail.value })
  },
  
  onCityChange(e) {
    this.setData({ cityIndex: e.detail.value })
  },
  
  onFundRateChange(e) {
    this.setData({ fundRateIndex: e.detail.value })
  },
  
  calculate() {
    const { actualSalary, baseSalary, cities, cityIndex, fundRates, fundRateIndex } = this.data
    
    // 验证输入
    if (!actualSalary || !baseSalary) {
      wx.showToast({ title: '请填写完整信息', icon: 'none' })
      return
    }
    
    if (parseFloat(baseSalary) > parseFloat(actualSalary)) {
      wx.showToast({ title: '缴纳基数不能大于实际工资', icon: 'none' })
      return
    }
    
    // 计算
    const result = calculate({
      actualSalary: parseFloat(actualSalary),
      baseSalary: parseFloat(baseSalary),
      city: cities[cityIndex],
      fundRate: fundRates[fundRateIndex] / 100
    })
    
    if (result.error) {
      wx.showToast({ title: result.error, icon: 'none' })
      return
    }
    
    // 存储结果
    const app = getApp()
    app.globalData.currentResult = {
      ...result,
      input: {
        actualSalary,
        baseSalary,
        city: cities[cityIndex],
        fundRate: fundRates[fundRateIndex]
      }
    }
    
    // 跳转结果页
    wx.navigateTo({ url: '/pages/result/result' })
  },
  
  goHistory() {
    wx.navigateTo({ url: '/pages/history/history' })
  }
})