# GitHub Actions Workflow 分支管理

## 问题描述

当项目使用 GitHub Pages 部署时，经常会遇到这样的情况：
- 修改了 main 分支的 workflow 文件
- 但 GitHub Actions 运行时还是使用旧的配置
- 导致错误反复出现，每次修复后又会复发

## 根本原因

GitHub Pages 部署使用 gh-pages 分支（或自定义分支），当数据推送到 gh-pages 分支时：

1. **如果 gh-pages 分支也有 `.github/workflows/` 目录**
   - 触发的是 gh-pages 分支上的 workflow
   - 而不是 main 分支的 workflow

2. **main 分支和 gh-pages 分支的 workflow 文件不一致**
   - 修改了 main 分支，没修改 gh-pages 分支
   - 导致实际运行的是旧版本

## 解决方案

### 方案一：同步更新两个分支（推荐）

每次修改 workflow 时，确保两个分支都更新：

```bash
# 1. 更新 main 分支
git checkout main
# 修改 .github/workflows/xxx.yml
git add .github/workflows/
git commit -m "update workflow"
git push origin main

# 2. 同步更新 gh-pages 分支
git checkout gh-pages
git cherry-pick main  # 或者手动修改
git add .github/workflows/
git commit -m "sync workflow from main"
git push origin gh-pages
```

### 方案二：只在 main 分支保留 workflow

删除 gh-pages 分支的 `.github/workflows/` 目录：

```bash
git checkout gh-pages
rm -rf .github/workflows/
git add .github/workflows/
git commit -m "remove workflow from gh-pages"
git push origin gh-pages
```

然后在 main 分支的 workflow 中，使用 `workflow_dispatch` 或 `repository_dispatch` 触发。

### 方案三：使用 workflow_dispatch 手动触发

不监听分支 push，改为手动触发或定时触发：

```yaml
on:
  # 不监听 gh-pages 分支的 push
  # push:
  #   branches:
  #     - gh-pages
  
  # 改为定时触发
  schedule:
    - cron: '*/5 * * * *'  # 每5分钟
  
  # 或手动触发
  workflow_dispatch:
```

## 检查方法

检查两个分支的 workflow 是否一致：

```bash
# 查看 main 分支的 workflow
git show main:.github/workflows/xxx.yml

# 查看 gh-pages 分支的 workflow
git show gh-pages:.github/workflows/xxx.yml
```

## 常见错误

### 错误1：ES Module 兼容性问题
```
ReferenceError: require is not defined in ES module scope
```

**原因**: 
- `package.json` 设置了 `"type": "module"`
- workflow 文件使用了 `.js` 扩展名
- Node.js 将 `.js` 文件当作 ES Module 处理

**解决**: 
- 将脚本文件改为 `.cjs` 扩展名
- 或者在 `package.json` 中移除 `"type": "module"`

### 错误2：workflow 文件路径错误
```
Error: Unable to resolve action `xxx`, repository not found
```

**原因**:
- gh-pages 分支缺少 workflow 依赖的文件
- 或者 workflow 中引用的路径不正确

**解决**:
- 确保 gh-pages 分支包含所有必要的文件
- 或者使用 `actions/checkout` 检出 main 分支的代码

## 最佳实践

1. **明确 workflow 触发逻辑**
   - 文档化说明哪个 workflow 在哪个分支运行
   - 避免两个分支都有 workflow 造成混淆

2. **统一使用 main 分支管理 workflow**
   - gh-pages 分支只存放构建产物
   - workflow 统一放在 main 分支
   - 使用 `workflow_dispatch` 或 API 触发

3. **定期检查和同步**
   - 每次修改 workflow 后，检查两个分支是否一致
   - 可以设置 CI 检查确保一致性

## 案例

### 本项目的问题

**场景**:
- main 分支：`.github/scripts/sync-to-notion.cjs`
- gh-pages 分支：`.github/scripts/sync-to-notion.js`

**错误**:
```
Run node .github/scripts/sync-to-notion.js
Error: require is not defined in ES module scope
```

**解决**:
```bash
# 同步更新 gh-pages 分支
git checkout gh-pages
mv .github/scripts/sync-to-notion.js .github/scripts/sync-to-notion.cjs
# 更新 workflow 文件引用
sed -i 's/sync-to-notion.js/sync-to-notion.cjs/g' .github/workflows/sync-to-notion.yml
git add -A
git commit -m "sync: update workflow from main"
git push origin gh-pages
```

## 总结

**核心原则**: 
> 当项目使用 GitHub Pages 部署，且多个分支都有 workflow 文件时，
> 必须确保所有分支的 workflow 文件保持一致，
> 或者明确只在特定分支运行 workflow。

**检查清单**:
- [ ] 确认哪个分支的 workflow 会被触发
- [ ] 确认该分支的 workflow 文件是最新的
- [ ] 确认 workflow 引用的脚本文件存在且正确
- [ ] 确认脚本文件的扩展名与 module 类型匹配
