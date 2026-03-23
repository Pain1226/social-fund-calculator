// 测试策略配置
module.exports = {
  // 测试范围
  testScope: [
    {
      module: 'calculator.js',
      priority: 'P0',
      description: '核心计算逻辑，必须全面测试'
    },
    {
      module: 'policy.js',
      priority: 'P0',
      description: '政策数据，验证数据完整性'
    },
    {
      module: 'storage.js',
      priority: 'P1',
      description: '存储逻辑，小程序环境需mock'
    }
  ],
  
  // 测试用例设计
  testCases: {
    calculator: [
      { name: '正常计算-北京', input: { actualSalary: 10000, baseSalary: 3000, city: '北京', fundRate: 0.12 } },
      { name: '正常计算-上海', input: { actualSalary: 10000, baseSalary: 3000, city: '上海', fundRate: 0.07 } },
      { name: '正常计算-广州', input: { actualSalary: 10000, baseSalary: 3000, city: '广州', fundRate: 0.12 } },
      { name: '正常计算-深圳', input: { actualSalary: 10000, baseSalary: 3000, city: '深圳', fundRate: 0.12 } },
      { name: '边界-基数为0', input: { actualSalary: 10000, baseSalary: 0, city: '北京', fundRate: 0.12 } },
      { name: '边界-基数等于工资', input: { actualSalary: 10000, baseSalary: 10000, city: '北京', fundRate: 0.12 }, expectedDiff: 0 },
      { name: '边界-工资低于基数下限', input: { actualSalary: 3000, baseSalary: 3000, city: '北京', fundRate: 0.12 } },
      { name: '边界-工资高于基数上限', input: { actualSalary: 50000, baseSalary: 50000, city: '北京', fundRate: 0.12 } },
      { name: '异常-不存在的城市', input: { actualSalary: 10000, baseSalary: 3000, city: '杭州', fundRate: 0.12 }, expectedError: true }
    ],
    policy: [
      { name: '获取一线城市列表', test: 'getCities返回4个城市' },
      { name: '北京政策完整性', test: '北京政策包含所有险种' },
      { name: '基数上下限', test: 'adjustBase正确处理上下限' }
    ]
  }
}