#!/bin/bash

# run-automation.sh - 自动化任务执行脚本
# 企业出海服务评测系统

set -e

MAX_RUNS=${1:-9999}
RUN_COUNT=0
LOG_DIR="automation-logs"
TASK_FILE="../task.json"
PROGRESS_FILE="../progress.txt"

echo "🤖 Auto Coding Agent 自动化执行"
echo "================================"
echo ""

# 创建日志目录
mkdir -p "$LOG_DIR"

# 检查必要文件
if [ ! -f "$TASK_FILE" ]; then
    echo "❌ 错误：未找到 $TASK_FILE"
    exit 1
fi

if [ ! -f "$PROGRESS_FILE" ]; then
    echo "⚠️ 警告：未找到 $PROGRESS_FILE，将创建新文件"
    touch "$PROGRESS_FILE"
fi

# 获取当前时间戳
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="$LOG_DIR/run-${TIMESTAMP}.log"

echo "📋 任务文件: $TASK_FILE"
echo "📝 进度文件: $PROGRESS_FILE"
echo "📄 日志文件: $LOG_FILE"
echo "🔄 最大运行次数: $MAX_RUNS"
echo ""

# 记录开始时间
echo "[$(date)] 自动化执行开始" >> "$LOG_FILE"
echo "================================" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"

# 主循环
while [ $RUN_COUNT -lt $MAX_RUNS ]; do
    RUN_COUNT=$((RUN_COUNT + 1))
    
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🔄 运行 #$RUN_COUNT / $MAX_RUNS"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    
    echo "[$(date)] 运行 #$RUN_COUNT 开始" >> "$LOG_FILE"
    
    # 读取 task.json 检查是否有未完成的任务
    # 这里可以添加读取 task.json 的逻辑
    
    # 检查是否有未完成的任务
    PENDING_TASKS=$(cat "$TASK_FILE" | grep -c '"passes": false' || echo "0")
    
    if [ "$PENDING_TASKS" = "0" ]; then
        echo "✅ 所有任务已完成！"
        echo "[$(date)] 所有任务已完成" >> "$LOG_FILE"
        break
    fi
    
    echo "📊 剩余未完成任务: $PENDING_TASKS"
    echo "[$(date)] 剩余任务: $PENDING_TASKS" >> "$LOG_FILE"
    
    # 运行开发服务器（如果需要）
    # npm run dev &
    # DEV_PID=$!
    
    # 等待用户输入或继续执行
    echo ""
    echo "⏳ 等待手动执行任务..."
    echo "   完成后按 Enter 继续，或输入 'stop' 停止"
    
    read -r INPUT
    
    if [ "$INPUT" = "stop" ] || [ "$INPUT" = "exit" ] || [ "$INPUT" = "quit" ]; then
        echo "🛑 用户停止执行"
        echo "[$(date)] 用户停止执行" >> "$LOG_FILE"
        break
    fi
    
    echo "[$(date)] 运行 #$RUN_COUNT 完成" >> "$LOG_FILE"
    echo "" >> "$LOG_FILE"
    
done

echo ""
echo "================================"
echo "🏁 自动化执行结束"
echo "📄 日志保存于: $LOG_FILE"
echo "================================"
echo ""

# 记录结束时间
echo "[$(date)] 自动化执行结束，共运行 $RUN_COUNT 次" >> "$LOG_FILE"
