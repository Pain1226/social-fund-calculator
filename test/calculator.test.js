/**
 * 计算逻辑单元测试
 * 测试Agent 自动生成
 */

const { calculate } = require('../utils/calculator')
const { getPolicy, getCities, adjustBase, policies } = require('../utils/policy')

describe('Calculator - 计算逻辑测试', () => {
  
  describe('正常计算场景', () => {
    
    test('北京 - 工资10000 基数3000', () => {
      const result = calculate({
        actualSalary: 10000,
        baseSalary: 3000,
        city: '北京',
        fundRate: 0.12
      })
      
      expect(result.error).toBeUndefined()
      expect(result.input.actualSalary).toBe(10000)
      expect(result.input.baseSalary).toBe(3000)
      expect(parseFloat(result.summary.diffTotal)).toBeGreaterThan(0)
      
      // 验证社保明细
      expect(result.social.details.length).toBe(5) // 5个险种
      
      // 验证公积金
      expect(parseFloat(result.fund.diffCompany)).toBeGreaterThan(0)
    })
    
    test('上海 - 工资10000 基数3000', () => {
      const result = calculate({
        actualSalary: 10000,
        baseSalary: 3000,
        city: '上海',
        fundRate: 0.07
      })
      
      expect(result.error).toBeUndefined()
      expect(parseFloat(result.summary.diffTotal)).toBeGreaterThan(0)
    })
    
    test('广州 - 工资10000 基数3000', () => {
      const result = calculate({
        actualSalary: 10000,
        baseSalary: 3000,
        city: '广州',
        fundRate: 0.12
      })
      
      expect(result.error).toBeUndefined()
      expect(parseFloat(result.summary.diffTotal)).toBeGreaterThan(0)
    })
    
    test('深圳 - 工资10000 基数3000', () => {
      const result = calculate({
        actualSalary: 10000,
        baseSalary: 3000,
        city: '深圳',
        fundRate: 0.12
      })
      
      expect(result.error).toBeUndefined()
      expect(parseFloat(result.summary.diffTotal)).toBeGreaterThan(0)
    })
    
  })
  
  describe('边界场景', () => {
    
    test('基数等于工资 - 差额应为0', () => {
      const result = calculate({
        actualSalary: 10000,
        baseSalary: 10000,
        city: '北京',
        fundRate: 0.12
      })
      
      expect(result.error).toBeUndefined()
      expect(parseFloat(result.summary.diffTotal)).toBe(0)
    })
    
    test('基数为0 - 应按最低基数计算', () => {
      const result = calculate({
        actualSalary: 10000,
        baseSalary: 0,
        city: '北京',
        fundRate: 0.12
      })
      
      expect(result.error).toBeUndefined()
      // 基数会被调整为下限
      expect(result.input.adjustedCompanyBase).toBeGreaterThan(0)
    })
    
    test('工资低于基数下限', () => {
      const result = calculate({
        actualSalary: 3000,
        baseSalary: 3000,
        city: '北京',
        fundRate: 0.12
      })
      
      expect(result.error).toBeUndefined()
      // 实际基数应被调整为下限
      expect(result.input.adjustedActualBase).toBe(6326) // 北京下限
    })
    
    test('工资高于基数上限', () => {
      const result = calculate({
        actualSalary: 50000,
        baseSalary: 50000,
        city: '北京',
        fundRate: 0.12
      })
      
      expect(result.error).toBeUndefined()
      // 实际基数应被调整为上限
      expect(result.input.adjustedActualBase).toBe(33891) // 北京上限
    })
    
  })
  
  describe('异常场景', () => {
    
    test('不存在的城市', () => {
      const result = calculate({
        actualSalary: 10000,
        baseSalary: 3000,
        city: '杭州',
        fundRate: 0.12
      })
      
      expect(result.error).toBe('未找到该城市的政策数据')
    })
    
  })
  
  describe('计算准确性验证', () => {
    
    test('北京 - 验证养老险差额计算（基数低于下限会被调整）', () => {
      const result = calculate({
        actualSalary: 10000,
        baseSalary: 3000,
        city: '北京',
        fundRate: 0.12
      })
      
      // 养老险公司比例16%
      // 实际工资10000在范围内，基数调整为下限6326
      // 应缴: 10000 * 0.16 = 1600
      // 实缴: 6326 * 0.16 = 1012.16
      // 差额: 1600 - 1012.16 = 587.84
      
      const yanglao = result.social.details.find(d => d.name === '养老')
      expect(yanglao).toBeDefined()
      expect(parseFloat(yanglao.diffCompany)).toBeCloseTo(587.84, 1)
    })
    
    test('北京 - 验证公积金差额计算（基数低于下限会被调整）', () => {
      const result = calculate({
        actualSalary: 10000,
        baseSalary: 3000,
        city: '北京',
        fundRate: 0.12
      })
      
      // 公积金比例12%
      // 基数调整为下限6326
      // 应缴: 10000 * 0.12 = 1200
      // 实缴: 6326 * 0.12 = 759.12
      // 差额: 1200 - 759.12 = 440.88
      
      expect(parseFloat(result.fund.diffCompany)).toBeCloseTo(440.88, 1)
    })
    
    test('基数在范围内 - 验证精确计算', () => {
      // 使用在基数范围内的值，验证精确计算
      const result = calculate({
        actualSalary: 10000,
        baseSalary: 8000,
        city: '北京',
        fundRate: 0.12
      })
      
      // 养老差额: (10000 - 8000) * 0.16 = 320
      const yanglao = result.social.details.find(d => d.name === '养老')
      expect(parseFloat(yanglao.diffCompany)).toBeCloseTo(320, 1)
      
      // 公积金差额: (10000 - 8000) * 0.12 = 240
      expect(parseFloat(result.fund.diffCompany)).toBeCloseTo(240, 1)
    })
    
    test('年度差额计算', () => {
      const result = calculate({
        actualSalary: 10000,
        baseSalary: 3000,
        city: '北京',
        fundRate: 0.12
      })
      
      const monthlyDiff = parseFloat(result.summary.diffTotal)
      const yearlyDiff = parseFloat(result.summary.yearlyDiff)
      
      expect(yearlyDiff).toBeCloseTo(monthlyDiff * 12, 0) // 放宽精度
    })
    
  })
  
})

describe('Policy - 政策数据测试', () => {
  
  test('获取一线城市列表', () => {
    const cities = getCities()
    expect(cities).toContain('北京')
    expect(cities).toContain('上海')
    expect(cities).toContain('广州')
    expect(cities).toContain('深圳')
    expect(cities.length).toBe(4)
  })
  
  test('北京政策完整性', () => {
    const policy = getPolicy('北京')
    
    expect(policy).toBeDefined()
    expect(policy.social).toBeDefined()
    expect(policy.fund).toBeDefined()
    expect(policy.baseLimit).toBeDefined()
    
    // 验证所有险种
    expect(policy.social.养老).toBeDefined()
    expect(policy.social.医疗).toBeDefined()
    expect(policy.social.失业).toBeDefined()
    expect(policy.social.工伤).toBeDefined()
    expect(policy.social.生育).toBeDefined()
    
    // 验证比例值在合理范围
    expect(policy.social.养老.company).toBeGreaterThan(0)
    expect(policy.social.养老.personal).toBeGreaterThan(0)
  })
  
  test('基数调整 - 低于下限', () => {
    const adjusted = adjustBase(1000, '北京')
    expect(adjusted).toBe(6326) // 北京下限
  })
  
  test('基数调整 - 高于上限', () => {
    const adjusted = adjustBase(100000, '北京')
    expect(adjusted).toBe(33891) // 北京上限
  })
  
  test('基数调整 - 在范围内', () => {
    const adjusted = adjustBase(10000, '北京')
    expect(adjusted).toBe(10000)
  })
  
  test('各城市政策都有基数上下限', () => {
    const cities = getCities()
    cities.forEach(city => {
      const policy = getPolicy(city)
      expect(policy.baseLimit.min).toBeGreaterThan(0)
      expect(policy.baseLimit.max).toBeGreaterThan(policy.baseLimit.min)
    })
  })
  
})

describe('Storage - 存储逻辑测试', () => {
  
  // Mock wx 对象
  beforeEach(() => {
    global.wx = {
      getStorageSync: jest.fn(),
      setStorageSync: jest.fn(),
      removeStorageSync: jest.fn()
    }
  })
  
  afterEach(() => {
    delete global.wx
  })
  
  test('getHistory - 空历史', () => {
    wx.getStorageSync.mockReturnValue([])
    
    const { getHistory } = require('../utils/storage')
    const history = getHistory()
    
    expect(history).toEqual([])
  })
  
  test('getHistory - 有历史记录', () => {
    const mockHistory = [{ id: 1, city: '北京' }]
    wx.getStorageSync.mockReturnValue(mockHistory)
    
    const { getHistory } = require('../utils/storage')
    const history = getHistory()
    
    expect(history).toEqual(mockHistory)
  })
  
  test('saveRecord - 添加新记录', () => {
    wx.getStorageSync.mockReturnValue([])
    wx.setStorageSync.mockReturnValue(true)
    
    const { saveRecord } = require('../utils/storage')
    const record = { actualSalary: 10000, baseSalary: 3000 }
    const saved = saveRecord(record)
    
    expect(saved).not.toBeNull()
    expect(saved.id).toBeDefined()
    expect(saved.createTime).toBeDefined()
    expect(wx.setStorageSync).toHaveBeenCalled()
  })
  
})