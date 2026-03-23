# 社保公积金差额计算器

微信小程序 - 计算社保公积金差额

## 功能

- 输入实际工资和缴纳基数，计算差额
- 支持一线城市政策数据（北京、上海、广州、深圳）
- 公积金比例可自定义（5%-12%）
- 本地保存历史记录

## 使用方法

1. 克隆仓库
```bash
git clone https://github.com/Pain1226/social-fund-calculator.git
```

2. 用微信开发者工具打开项目

3. 填入 AppID 或使用测试号

4. 编译运行

## 免责声明

本计算结果仅供参考，实际缴纳金额以当地社保局/公积金中心核定为准。

## 项目结构

```
social-fund-calculator/
├── pages/
│   ├── index/          # 首页（计算器）
│   ├── result/         # 结果页
│   └── history/        # 历史记录
├── utils/
│   ├── calculator.js   # 计算逻辑
│   ├── storage.js      # 本地存储
│   └── policy.js       # 政策数据
├── app.js
├── app.json
├── app.wxss
└── sitemap.json
```