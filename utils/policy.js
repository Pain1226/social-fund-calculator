// 一线城市社保公积金政策数据
// 数据来源：各地人社局官网，仅供参考
// 更新时间：2026年

const policies = {
  "北京": {
    social: {
      养老: { company: 0.16, personal: 0.08 },
      医疗: { company: 0.10, personal: 0.02 },
      失业: { company: 0.008, personal: 0.002 },
      工伤: { company: 0.004, personal: 0 },
      生育: { company: 0, personal: 0 } // 已并入医疗
    },
    fund: {
      company: 0.12,
      personal: 0.12
    },
    baseLimit: {
      min: 6326,
      max: 33891
    }
  },
  "上海": {
    social: {
      养老: { company: 0.16, personal: 0.08 },
      医疗: { company: 0.10, personal: 0.02 },
      失业: { company: 0.005, personal: 0.005 },
      工伤: { company: 0.0026, personal: 0 },
      生育: { company: 0, personal: 0 }
    },
    fund: {
      company: 0.07,
      personal: 0.07
    },
    baseLimit: {
      min: 7384,
      max: 36954
    }
  },
  "广州": {
    social: {
      养老: { company: 0.15, personal: 0.08 },
      医疗: { company: 0.055, personal: 0.02 },
      失业: { company: 0.008, personal: 0.002 },
      工伤: { company: 0.002, personal: 0 },
      生育: { company: 0.0085, personal: 0 }
    },
    fund: {
      company: 0.12,
      personal: 0.12
    },
    baseLimit: {
      min: 5500,
      max: 29979
    }
  },
  "深圳": {
    social: {
      养老: { company: 0.15, personal: 0.08 },
      医疗: { company: 0.05, personal: 0.02 },
      失业: { company: 0.007, personal: 0.003 },
      工伤: { company: 0.0014, personal: 0 },
      生育: { company: 0, personal: 0 }
    },
    fund: {
      company: 0.12,
      personal: 0.12
    },
    baseLimit: {
      min: 2360,
      max: 38892
    }
  }
}

// 获取城市政策
function getPolicy(city) {
  return policies[city] || null
}

// 获取所有城市
function getCities() {
  return Object.keys(policies)
}

// 调整基数（在上下限范围内）
function adjustBase(base, city) {
  const policy = policies[city]
  if (!policy) return base
  
  const { min, max } = policy.baseLimit
  if (base < min) return min
  if (base > max) return max
  return base
}

module.exports = {
  policies,
  getPolicy,
  getCities,
  adjustBase
}