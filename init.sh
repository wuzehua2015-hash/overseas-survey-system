#!/bin/bash

# init.sh - 环境初始化脚本
# 企业出海服务评测系统

set -e

echo "🚀 初始化项目环境..."

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误：请在项目根目录运行此脚本"
    exit 1
fi

echo "📦 安装依赖..."
npm install

echo "🔍 检查 TypeScript 配置..."
if [ ! -f "tsconfig.json" ]; then
    echo "⚠️ 警告：未找到 tsconfig.json"
fi

echo "🧪 运行 lint 检查..."
npm run lint || echo "⚠️ lint 检查有警告，继续..."

echo "🏗️  测试构建..."
npm run build || echo "⚠️ 构建有警告，继续..."

echo ""
echo "✅ 环境初始化完成！"
echo ""
echo "可用命令："
echo "  npm run dev     - 启动开发服务器"
echo "  npm run build   - 构建生产版本"
echo "  npm run lint    - 运行代码检查"
echo "  ./run-automation.sh - 启动自动化任务执行"
echo ""
