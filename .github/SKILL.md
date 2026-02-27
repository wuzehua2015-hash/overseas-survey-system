# GitHub → Notion 数据同步完整技术指南

## 概述

本项目实现了从 GitHub 自动同步数据到 Notion 数据库的功能。这是一个经过多次迭代才彻底解决的复杂问题，涉及 GitHub Actions、Node.js Module 系统、多分支管理等多个技术点。

---

## 问题背景

### 需求
- 用户提交问卷数据存储在 GitHub（gh-pages 分支）
- 需要自动同步到 Notion 数据库便于管理
- 支持双数据库：完整问卷 + 预约咨询

### 技术挑战
1. **GitHub Pages 使用 gh-pages 分支**，与 main 分支分离
2. **Node.js Module 系统复杂**，ES Module 和 CommonJS 混用容易出错
3. **GitHub Actions 多分支触发**，workflow 文件位置影响执行

---

## 完整解决方案

### 第一步：理解 Module 系统

#### ES Module vs CommonJS

| 特性 | ES Module | CommonJS |
|------|-----------|----------|
| 文件扩展名 | `.mjs` 或 `.js`（package.json 设置 type: module） | `.cjs` 或 `.js`（默认） |
| 导入语法 | `import xxx from 'xxx'` | `const xxx = require('xxx')` |
| 导出语法 | `export default xxx` | `module.exports = xxx` |
| Node.js 支持 | v12+（需开启）v15+（默认） | 所有版本 |

#### 如何选择？

**推荐：使用 CommonJS（.cjs）**
- 兼容性更好
- GitHub Actions 默认支持
- 不需要额外配置 package.json

### 第二步：项目结构设计

```
.github/
├── workflows/
│   └── sync-to-notion.yml    # workflow 配置
├── scripts/
│   └── sync-to-notion.cjs    # 同步脚本（CommonJS）
└── SKILL.md                  # 本文档
```

### 第三步：编写同步脚本

```javascript
// .github/scripts/sync-to-notion.cjs

// 1. 导入内置模块（CommonJS 语法）
const https = require('https');
const fs = require('fs');
const path = require('path');

// 2. 配置常量
const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;
const DATA_DIR = process.env.DATA_PATH || 'data/submissions';

// 3. 数据映射（与前端保持一致）
const INDUSTRY_MAP = {
  'machinery': '机械设备',
  'electronics': '电子电气',
  // ... 更多行业
};

// 4. 读取提交数据
function getSubmissions() {
  try {
    const files = fs.readdirSync(DATA_DIR);
    const submissions = [];
    
    for (const file of files) {
      if (file.endsWith('.json')) {
        const content = fs.readFileSync(path.join(DATA_DIR, file), 'utf8');
        const data = JSON.parse(content);
        submissions.push(data);
      }
    }
    
    return submissions;
  } catch (error) {
    console.error('读取数据失败:', error);
    return [];
  }
}

// 5. 主函数
async function main() {
  console.log('=== 开始同步到 Notion ===');
  
  try {
    const submissions = getSubmissions();
    console.log(`读取到 ${submissions.length} 条提交记录`);
    
    // 同步逻辑...
    
    console.log('=== 同步完成 ===');
  } catch (error) {
    console.error('同步失败:', error);
    process.exit(1);
  }
}

// 执行
main();
```

### 第四步：配置 GitHub Actions

```yaml
# .github/workflows/sync-to-notion.yml
name: Sync to Notion

on:
  push:
    branches:
      - gh-pages
    paths:
      - 'data/submissions/**'
  workflow_dispatch:

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          ref: main
          path: main
      
      - uses: actions/checkout@v4
        with:
          ref: gh-pages
          path: gh-pages
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Sync to Notion
        working-directory: ./main
        run: node .github/scripts/sync-to-notion.cjs
        env:
          NOTION_API_KEY: ${{ secrets.NOTION_API_KEY }}
          NOTION_DATABASE_ID: ${{ secrets.NOTION_DATABASE_ID }}
          DATA_PATH: '../gh-pages/data/submissions'
```

### 第五步：多分支同步（关键！）

**问题**：main 分支和 gh-pages 分支都有 `.github/` 目录

**解决方案**：

```bash
# 1. 更新 main 分支
git checkout main
# 修改 .github/scripts/sync-to-notion.cjs
git add .github/
git commit -m "update sync script"
git push origin main

# 2. 同步更新 gh-pages 分支（必须做！）
git checkout gh-pages
git cherry-pick main  # 或者手动复制修改
git add .github/
git commit -m "sync sync-to-notion from main"
git push origin gh-pages
```

---

## 常见错误及解决

### 错误 1：require is not defined
```
ReferenceError: require is not defined in ES module scope
```

**原因**：在 ES Module 环境（package.json 设置了 "type": "module"）中使用 CommonJS 语法

**解决**：
- 方案A：将文件扩展名改为 `.cjs`
- 方案B：使用 ES Module 语法（`import`）

### 错误 2：Cannot use import statement
```
SyntaxError: Cannot use import statement outside a module
```

**原因**：在 CommonJS 环境（.cjs 文件或默认 .js）中使用 ES Module 语法

**解决**：
- 方案A：将 `import` 改为 `require`
- 方案B：将文件扩展名改为 `.mjs`

### 错误 3：Workflow 不触发或运行旧版本
```
Run node .github/scripts/sync-to-notion.js  # 旧版本
```

**原因**：gh-pages 分支的 workflow 文件没有更新

**解决**：
```bash
# 确保 gh-pages 分支也更新了
git checkout gh-pages
git log --oneline -5  # 检查最新提交
```

---

## 最佳实践

### 1. 使用 .cjs 扩展名
```bash
# 明确使用 CommonJS
sync-to-notion.cjs

# 避免使用 .js（可能被当作 ES Module）
# sync-to-notion.js  ❌
```

### 2. 统一语法风格
```javascript
// ✅ 推荐：纯 CommonJS
const https = require('https');
const fs = require('fs');

// ❌ 避免：混用
import https from 'https';  // ES Module
const fs = require('fs');   // CommonJS
```

### 3. 双分支检查清单
- [ ] main 分支脚本已更新
- [ ] main 分支 workflow 已更新
- [ ] gh-pages 分支脚本已同步
- [ ] gh-pages 分支 workflow 已同步
- [ ] GitHub Secrets 已配置
- [ ] 测试运行成功

### 4. 调试技巧
```bash
# 本地测试脚本
node .github/scripts/sync-to-notion.cjs

# 设置环境变量测试
export NOTION_API_KEY=xxx
export NOTION_DATABASE_ID=xxx
node .github/scripts/sync-to-notion.cjs
```

---

## 本项目完整修复历程

### 第 1 次修复：改为 ES Module
- 将 `require` 改为 `import`
- 问题：gh-pages 分支还是旧版本

### 第 2 次修复：同步 gh-pages 分支
- 更新 gh-pages 分支的脚本
- 问题：又变回了 CommonJS 语法

### 第 3 次修复：使用 .cjs 扩展名
- 将 `.js` 改为 `.cjs`
- 问题：脚本内容还是 ES Module 语法

### 第 4 次修复：统一 CommonJS 语法
- 将 `import` 改为 `require`
- 同步更新两个分支
- **最终成功！**

---

## 总结

**核心原则**：
1. **扩展名决定 Module 类型**：`.cjs` = CommonJS，`.mjs` = ES Module
2. **语法必须一致**：CommonJS 用 `require`，ES Module 用 `import`
3. **多分支必须同步**：main 和 gh-pages 分支的脚本要保持一致

**推荐方案**：
- 使用 `.cjs` 扩展名
- 使用 CommonJS 语法（`require`）
- 同步更新 main 和 gh-pages 分支

---

**文档版本**：v1.0  
**最后更新**：2026-02-27  
**作者**：Auto Coding Agent
