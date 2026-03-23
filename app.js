App({
  onLaunch() {
    // 初始化本地存储
    const history = wx.getStorageSync('calc_history') || []
    this.globalData.history = history
  },
  globalData: {
    history: [],
    currentResult: null
  }
})