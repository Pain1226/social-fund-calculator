// 计算逻辑

const { getPolicy, adjustBase } = require('./policy')

/**
 * 计算社保公积金差额
 * @param {Object} params
 * @param {number} params.actualSalary - 实际工资
 * @param {number} params.baseSalary - 缴纳基数（公司使用的）
 * @param {string} params.city - 城市
 * @param {number} params.fundRate - 公积金比例（可选，默认使用城市政策）
 * @returns {Object} 计算结果
 */
function calculate(params) {
  const { actualSalary, baseSalary, city, fundRate } = params
  
  const policy = getPolicy(city)
  if (!policy) {
    return { error: '未找到该城市的政策数据' }
  }
  
  // 调整基数（考虑上下限）
  const adjustedActualBase = adjustBase(actualSalary, city)
  const adjustedCompanyBase = adjustBase(baseSalary, city)
  
  // 计算各险种差额
  const socialDetails = []
  let socialDiffCompany = 0
  let socialDiffPersonal = 0
  
  for (const [name, rate] of Object.entries(policy.social)) {
    const actualCompany = adjustedActualBase * rate.company
    const actualPersonal = adjustedActualBase * rate.personal
    const companyCompany = adjustedCompanyBase * rate.company
    const companyPersonal = adjustedCompanyBase * rate.personal
    
    const diffCompany = actualCompany - companyCompany
    const diffPersonal = actualPersonal - companyPersonal
    
    socialDetails.push({
      name,
      rate: rate,
      actualCompany: actualCompany.toFixed(2),
      actualPersonal: actualPersonal.toFixed(2),
      companyCompany: companyCompany.toFixed(2),
      companyPersonal: companyPersonal.toFixed(2),
      diffCompany: diffCompany.toFixed(2),
      diffPersonal: diffPersonal.toFixed(2)
    })
    
    socialDiffCompany += diffCompany
    socialDiffPersonal += diffPersonal
  }
  
  // 计算公积金差额
  const fundRateValue = fundRate || policy.fund.company
  const fundActualCompany = adjustedActualBase * fundRateValue
  const fundActualPersonal = adjustedActualBase * fundRateValue
  const fundCompanyCompany = adjustedCompanyBase * fundRateValue
  const fundCompanyPersonal = adjustedCompanyBase * fundRateValue
  
  const fundDiffCompany = fundActualCompany - fundCompanyCompany
  const fundDiffPersonal = fundActualPersonal - fundCompanyPersonal
  
  const fundDetails = {
    rate: fundRateValue,
    actualCompany: fundActualCompany.toFixed(2),
    actualPersonal: fundActualPersonal.toFixed(2),
    companyCompany: fundCompanyCompany.toFixed(2),
    companyPersonal: fundCompanyPersonal.toFixed(2),
    diffCompany: fundDiffCompany.toFixed(2),
    diffPersonal: fundDiffPersonal.toFixed(2)
  }
  
  // 总差额
  const totalDiffCompany = socialDiffCompany + fundDiffCompany
  const totalDiffPersonal = socialDiffPersonal + fundDiffPersonal
  const totalDiff = totalDiffCompany + totalDiffPersonal
  
  return {
    input: {
      actualSalary,
      baseSalary,
      city,
      adjustedActualBase,
      adjustedCompanyBase
    },
    social: {
      details: socialDetails,
      diffCompany: socialDiffCompany.toFixed(2),
      diffPersonal: socialDiffPersonal.toFixed(2),
      diffTotal: (socialDiffCompany + socialDiffPersonal).toFixed(2)
    },
    fund: fundDetails,
    summary: {
      diffCompany: totalDiffCompany.toFixed(2),
      diffPersonal: totalDiffPersonal.toFixed(2),
      diffTotal: totalDiff.toFixed(2),
      monthlyDiff: totalDiff.toFixed(2),
      yearlyDiff: (totalDiff * 12).toFixed(2)
    }
  }
}

module.exports = {
  calculate
}