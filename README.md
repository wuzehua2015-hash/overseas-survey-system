# 聊商联盟会企业出海服务问卷系统

企业出海成熟度测评工具，帮助企业评估出海准备度，获取定制化出海方案。

**在线访问**: https://wuzehua2015-hash.github.io/overseas-survey-system/

---

## 技术栈

- **框架**: React 18 + TypeScript
- **构建工具**: Vite 7
- **UI组件**: shadcn/ui + Tailwind CSS
- **图表**: Recharts
- **二维码**: qrcode
- **海报生成**: html2canvas
- **数据存储**: GitHub Issues (通过API)
- **同步**: Notion Database

---

## 项目结构

```
src/
├── components/     # 可复用组件
│   ├── ui/        # shadcn/ui 组件
│   ├── ConsultationForm.tsx    # 咨询表单
│   ├── ShareReport.tsx         # 分享海报
│   └── ...
├── sections/       # 页面组件
│   ├── WelcomePage.tsx         # 首页
│   ├── ProfilePage.tsx         # 企业画像
│   ├── DiagnosisPage.tsx       # 出海诊断
│   ├── ProductPage.tsx         # 产品竞争力
│   ├── OperationPage.tsx       # 运营能力
│   ├── ResourcePage.tsx        # 资源规划
│   └── ReportPage.tsx          # 报告页面
├── hooks/          # 自定义 Hooks
│   └── useQuestionnaire.ts     # 问卷逻辑核心
├── data/           # 静态数据
│   └── benchmarkCompanies.ts   # 对标企业库
├── constants/      # 共享常量
│   └── industry.ts             # 行业映射
├── types/          # TypeScript 类型
├── services/       # 服务层
│   ├── githubStorage.ts        # GitHub存储
│   └── autoSubmit.ts           # 自动提交
└── utils/          # 工具函数
```

---

## 开发指南

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 部署到 GitHub Pages
```bash
npm run deploy
```

---

## 技术档案

### 一、遇到的技术难题与解决方案

#### 1. 分页导航状态丢失问题
**问题**: 用户填写多页问卷时，刷新页面后进度丢失
**原因**: localStorage 保存时机不当，页面跳转前未保存
**解决**: 在 `useSubStepNavigation` 中优化保存逻辑，确保跳转前保存
```typescript
const saveCurrentProgress = useCallback(() => {
  onSaveProgress?.(currentSubStep, ((currentSubStep + 1) / totalSubSteps) * 100);
}, [currentSubStep, totalSubSteps, onSaveProgress]);
```

#### 2. 行业名称英文显示问题
**问题**: 报告中建筑行业显示为 "building" 而非 "建材五金"
**原因**: 多处直接使用 `profile.industry` 英文值，未转换为中文
**解决**: 
- 创建 `src/constants/industry.ts` 统一映射表
- 在显示层统一使用 `INDUSTRY_MAP` 转换
- 在 `sync-to-notion.js` 中也使用相同映射

#### 3. 评分算法不合理
**问题**: 只填基本信息就显示"国际领航者"
**原因**: 基础分过高（50-40分），未考虑数据完整性
**解决**:
- 降低基础分（30-25-20分）
- 添加数据完整性检查
- 未填写信息的维度给予较低基础分

#### 4. 二维码生成失败
**问题**: 分享海报上的二维码显示为占位符
**原因**: 未安装二维码生成库
**解决**:
```bash
npm install qrcode @types/qrcode
```
使用 `useEffect` 异步生成二维码图片

#### 5. 进度条步骤数不匹配
**问题**: ResourcePage 显示4步，实际只有2个问题
**原因**: `subSteps.ts` 中配置与实际页面不匹配
**解决**: 同步更新 `STEP_CONFIG` 与实际页面步骤数

#### 6. GitHub → Notion 同步的完整技术方案 ⭐⭐⭐
**问题**: GitHub Actions 同步到 Notion 反复失败，经历多次修复才彻底解决

**完整解决方案**:

**第一步：选择正确的 Module 类型**
```bash
# 方案A：使用 ES Module（.mjs 或 package.json 设置 "type": "module"）
# 使用 import 语法
import https from 'https';

# 方案B：使用 CommonJS（.cjs 或默认 .js）
# 使用 require 语法
const https = require('https');
```

**第二步：处理多分支 workflow 问题**
```bash
# 关键：GitHub Pages 使用 gh-pages 分支
# 当数据推送到 gh-pages 分支时，触发的是 gh-pages 分支的 workflow

# 确保两个分支的脚本一致
# main 分支
git checkout main
# 修改 .github/scripts/sync-to-notion.cjs
git add .github/
git commit -m "update sync script"
git push origin main

# gh-pages 分支（必须同步更新！）
git checkout gh-pages
# 同步修改 .github/scripts/sync-to-notion.cjs
git add .github/
git commit -m "sync sync-to-notion from main"
git push origin gh-pages
```

**第三步：正确的脚本结构（CommonJS 方案）**
```javascript
// .github/scripts/sync-to-notion.cjs
const https = require('https');
const fs = require('fs');
const path = require('path');

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;

// 行业中文映射
const INDUSTRY_MAP = {
  'machinery': '机械设备',
  'electronics': '电子电气',
  // ...
};

// 读取提交数据
function getSubmissions() {
  const DATA_DIR = process.env.DATA_PATH || 'data/submissions';
  const files = fs.readdirSync(DATA_DIR);
  // ...
}

// 同步到 Notion
async function syncToNotion(submission) {
  const options = {
    hostname: 'api.notion.com',
    port: 443,
    path: `/v1/pages`,
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${NOTION_API_KEY}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28'
    }
  };
  // ...
}

// 主函数
async function main() {
  const submissions = getSubmissions();
  for (const submission of submissions) {
    await syncToNotion(submission);
  }
}

main().catch(console.error);
```

**第四步：workflow 配置**
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

**关键要点**:
1. **文件扩展名决定 Module 类型**：`.cjs` = CommonJS，`.mjs` = ES Module
2. **语法必须匹配**：CommonJS 用 `require`，ES Module 用 `import`
3. **多分支同步**：main 和 gh-pages 分支的脚本必须保持一致
4. **环境变量**：使用 `process.env` 读取 Secrets
5. **错误处理**：使用 try-catch 和 async/await 处理异步操作

**常见错误及解决**:
| 错误 | 原因 | 解决 |
|------|------|------|
| `require is not defined` | ES Module 环境用 CommonJS | 改为 `.cjs` 扩展名 |
| `Cannot use import statement` | CommonJS 环境用 ES Module | 改为 `require` 语法 |
| `module is not defined` | 混用两种语法 | 统一使用一种语法 |
| Workflow 不触发 | 分支不匹配 | 确保 workflow 文件在正确的分支 |

---
- `package.json` 设置了 `"type": "module"`，项目使用 ES Module
- `sync-to-notion.js` 使用了 `require('https')`，这是 CommonJS 语法
- Node.js 18+ 默认将 `.js` 文件当作 ES Module 处理

**临时解决方案（会复发）**:
- 将 `require` 改为 `import` 语法
- 但每次版本更新后又变回 CommonJS

**彻底解决方案**:
```bash
# 将文件扩展名从 .js 改为 .cjs
mv sync-to-notion.js sync-to-notion.cjs

# 更新 workflow 文件
run: node .github/scripts/sync-to-notion.cjs
```
- `.cjs` 扩展名强制 Node.js 使用 CommonJS 模式
- 不受 `package.json` 中 `"type": "module"` 影响
- **这是彻底解决，不会再复发**

---

### 二、编程注意事项

#### 1. 类型定义一致性
```typescript
// ❌ 错误：类型与实际使用不匹配
socialOperation: string  // 实际使用是对象

// ✅ 正确：类型与实际使用一致
socialOperation: {
  totalFollowers: string;
  monthlyContent: string;
  engagementRate: string;
  leadsGenerated: string;
}
```

#### 2. 常量提取与复用
```typescript
// ❌ 错误：多处定义相同映射
// hooks/useQuestionnaire.ts
const industryMap = { ... }
// sync-to-notion.js
const industryMap = { ... }

// ✅ 正确：提取到共享常量文件
// constants/industry.ts
export const INDUSTRY_MAP = { ... }
```

#### 3. 数据转换时机
```typescript
// ❌ 错误：原始数据直接显示
<div>{profile.industry}</div>  // 显示 "building"

// ✅ 正确：显示前转换
<div>{INDUSTRY_MAP[profile.industry] || profile.industry}</div>  // 显示 "建材五金"
```

#### 4. 异步操作处理
```typescript
// ✅ 使用 useEffect 处理异步生成
const [qrCodeUrl, setQrCodeUrl] = useState('');

useEffect(() => {
  const generateQR = async () => {
    const url = await QRCode.toDataURL(shareUrl, options);
    setQrCodeUrl(url);
  };
  generateQR();
}, [shareUrl]);
```

---

### 三、Git 注意事项

#### 1. 提交信息规范
```bash
# 功能开发
git commit -m "feat: 添加二维码生成功能"

# Bug修复
git commit -m "fix: 修复行业名称英文显示问题"

# 任务完成（Auto Coding Agent）
git commit -m "Task X完成：任务描述"
```

#### 2. 版本管理
- 使用 GitHub Pages 部署，main 分支自动部署
- 每次修改后必须构建测试通过再提交
- 重要修改保留详细提交信息

#### 3. 部署流程
```bash
npm run build    # 构建
npm run deploy   # 部署到 gh-pages
```

#### 4. GitHub Actions Workflow 分支管理 ⭐⭐⭐
**问题**: 修改了 main 分支的 workflow，但 gh-pages 分支的 workflow 还是旧的
**原因**: 
- GitHub Pages 部署使用 gh-pages 分支
- 当数据推送到 gh-pages 分支时，触发的是 gh-pages 分支上的 workflow
- main 分支和 gh-pages 分支都有 `.github/workflows/` 目录

**解决方案**:
```bash
# 确保两个分支的 workflow 文件一致
# 修改 main 分支后，也要同步修改 gh-pages 分支

git checkout main
# 修改 .github/workflows/xxx.yml
git add .github/workflows/
git commit -m "update workflow"
git push origin main

git checkout gh-pages
# 同步修改 .github/workflows/xxx.yml
git add .github/workflows/
git commit -m "sync workflow from main"
git push origin gh-pages
```

**最佳实践**:
- 或者只在 main 分支保留 workflow，gh-pages 分支删除 workflow
- 或者使用 `workflow_dispatch` 手动触发，而不是分支 push 触发

---

### 四、经验教训

#### 1. 一处修改，处处检查
- 修改页面结构时，必须同步更新 `types/subSteps.ts`
- 修改数据字段时，必须检查所有使用该字段的地方
- 修改类型定义时，必须检查所有相关组件

#### 2. 建立命名规范
- 行业代码统一使用英文小写（machinery, electronics）
- 阶段代码统一使用英文小写（preparation, exploration）
- 常量使用 UPPER_SNAKE_CASE（INDUSTRY_MAP）

#### 3. 数据流管理
- 原始数据（英文代码）存储和传输
- 显示数据（中文）在组件层转换
- 避免在多处重复转换逻辑

#### 4. 测试策略
- 每次修改后运行 `npm run build` 检查编译
- 关键功能修改后在浏览器验证
- 多维度数据（行业、阶段）都要测试

#### 5. 性能优化
- 构建产物较大（847KB），考虑代码分割
- 使用动态导入（dynamic import）优化首屏加载
- 图片资源使用适当压缩

---

### 五、关键配置文件

#### 1. 环境变量（.env）
```
VITE_GITHUB_TOKEN=your_github_token
NOTION_API_KEY=your_notion_api_key
NOTION_DATABASE_ID=your_database_id
NOTION_CONSULTATION_DATABASE_ID=your_consultation_db_id
```

#### 2. GitHub Actions（.github/workflows/）
- `deploy.yml`: 自动部署到 GitHub Pages
- `sync-to-notion.yml`: 自动同步数据到 Notion

#### 3. 任务管理
- `task.json`: Auto Coding Agent 任务定义
- `progress.txt`: 任务进度记录

---

## 更新日志

### V3.1 (2026-02-27)
- 修复行业名称英文显示问题
- 优化评分算法，降低基础分
- 重写服务推荐算法，添加行业维度
- 添加二维码生成功能
- 修复多处显示问题

### V3.0 (2026-02-26)
- 问卷精简优化（字段减少43%）
- 对标企业库扩充至35家
- 引入2024年权威市场数据
- 问卷分页式重构

---

## 贡献者

- 聊商联盟海外服务部

## License

MIT
