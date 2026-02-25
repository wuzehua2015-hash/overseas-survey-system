// ============================================================
// PDF报告生成服务 - 使用浏览器打印功能生成专业PDF
// ============================================================

import type { ReportData } from '@/types/questionnaire';

interface PDFGeneratorOptions {
  companyName: string;
  assessmentResult: ReportData['assessmentResult'];
  actionPlan: ReportData['actionPlan'];
}

export async function generateProfessionalPDF(options: PDFGeneratorOptions): Promise<void> {
  const { companyName, assessmentResult, actionPlan } = options;
  
  // 创建一个新的窗口用于打印
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('请允许弹出窗口以生成PDF');
    return;
  }
  
  // 生成HTML内容
  const htmlContent = generatePrintableHTML(companyName, assessmentResult, actionPlan);
  
  printWindow.document.write(htmlContent);
  printWindow.document.close();
  
  // 等待内容加载完成后打印
  printWindow.onload = () => {
    printWindow.print();
    // 打印完成后可以选择关闭窗口，但通常让用户自己关闭
    // printWindow.close();
  };
}

// 生成可打印的HTML内容
function generatePrintableHTML(
  companyName: string,
  assessmentResult: ReportData['assessmentResult'],
  actionPlan: ReportData['actionPlan']
): string {
  const stageColors: Record<string, string> = {
    preparation: '#64748b',
    exploration: '#10b981',
    growth: '#3b82f6',
    expansion: '#f59e0b',
    mature: '#8b5cf6',
  };
  
  const color = stageColors[assessmentResult.stage] || '#3b82f6';
  
  const dimensions = [
    { name: '基础能力', score: assessmentResult.dimensionScores.foundation, color: '#64748b' },
    { name: '产品竞争力', score: assessmentResult.dimensionScores.product, color: '#10b981' },
    { name: '运营能力', score: assessmentResult.dimensionScores.operation, color: '#3b82f6' },
    { name: '资源配置', score: assessmentResult.dimensionScores.resource, color: '#f59e0b' },
    { name: '发展潜力', score: assessmentResult.dimensionScores.potential, color: '#8b5cf6' },
  ];
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${companyName} - 出海成熟度评估报告</title>
      <style>
        @page {
          size: A4;
          margin: 15mm;
        }
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: "Microsoft YaHei", "SimHei", "Helvetica Neue", Arial, sans-serif;
          font-size: 12pt;
          line-height: 1.6;
          color: #333;
        }
        .page {
          width: 210mm;
          min-height: 297mm;
          padding: 20mm;
          margin: 0 auto;
          page-break-after: always;
        }
        .page:last-child {
          page-break-after: auto;
        }
        /* 封面样式 */
        .cover {
          background: linear-gradient(135deg, ${color} 0%, ${color}dd 100%);
          color: white;
          text-align: center;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        .cover-badge {
          background: rgba(255,255,255,0.2);
          padding: 8px 20px;
          border-radius: 20px;
          font-size: 10pt;
          margin-bottom: 40px;
        }
        .cover h1 {
          font-size: 32pt;
          margin-bottom: 10px;
        }
        .cover-subtitle {
          font-size: 14pt;
          opacity: 0.9;
          margin-bottom: 60px;
        }
        .cover-score {
          font-size: 72pt;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .cover-score-label {
          font-size: 12pt;
          opacity: 0.8;
          margin-bottom: 30px;
        }
        .cover-level {
          font-size: 18pt;
          font-weight: bold;
          padding: 10px 30px;
          border: 2px solid rgba(255,255,255,0.5);
          border-radius: 30px;
        }
        .cover-date {
          position: absolute;
          bottom: 40px;
          font-size: 10pt;
          opacity: 0.7;
        }
        /* 内容样式 */
        .content h2 {
          font-size: 18pt;
          color: #1a1a1a;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 2px solid ${color};
        }
        .dimension-item {
          margin-bottom: 15px;
        }
        .dimension-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 5px;
        }
        .dimension-name {
          font-weight: bold;
        }
        .dimension-score {
          color: ${color};
          font-weight: bold;
        }
        .progress-bar {
          height: 8px;
          background: #e5e7eb;
          border-radius: 4px;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          border-radius: 4px;
        }
        .action-section {
          margin-bottom: 20px;
        }
        .action-title {
          font-size: 12pt;
          font-weight: bold;
          color: white;
          padding: 8px 15px;
          border-radius: 5px;
          margin-bottom: 10px;
        }
        .action-list {
          list-style: none;
          padding-left: 0;
        }
        .action-list li {
          padding: 8px 0;
          padding-left: 25px;
          position: relative;
          border-bottom: 1px solid #f3f4f6;
        }
        .action-list li:before {
          content: "✓";
          position: absolute;
          left: 0;
          color: ${color};
          font-weight: bold;
        }
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      </style>
    </head>
    <body>
      <!-- 封面 -->
      <div class="page cover">
        <div class="cover-badge">聊商联盟海外服务部</div>
        <h1>${companyName}</h1>
        <div class="cover-subtitle">企业出海成熟度评估报告</div>
        <div class="cover-score">${assessmentResult.totalScore}</div>
        <div class="cover-score-label">综合得分</div>
        <div class="cover-level">${assessmentResult.level}</div>
        <div class="cover-date">报告生成日期：${new Date().toLocaleDateString('zh-CN')}</div>
      </div>
      
      <!-- 内容页 -->
      <div class="page content">
        <h2>五维能力评估</h2>
        ${dimensions.map(d => `
          <div class="dimension-item">
            <div class="dimension-header">
              <span class="dimension-name">${d.name}</span>
              <span class="dimension-score">${d.score}分</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${d.score}%; background: ${d.color}"></div>
            </div>
          </div>
        `).join('')}
        
        <h2 style="margin-top: 40px;">行动计划</h2>
        
        <div class="action-section">
          <div class="action-title" style="background: #10b981;">立即行动（1个月内）</div>
          <ul class="action-list">
            ${actionPlan.immediate.map(item => `<li>${item}</li>`).join('')}
          </ul>
        </div>
        
        <div class="action-section">
          <div class="action-title" style="background: #3b82f6;">短期行动（1-3个月）</div>
          <ul class="action-list">
            ${actionPlan.shortTerm.map(item => `<li>${item}</li>`).join('')}
          </ul>
        </div>
        
        <div class="action-section">
          <div class="action-title" style="background: #f59e0b;">中期行动（3-6个月）</div>
          <ul class="action-list">
            ${actionPlan.mediumTerm.map(item => `<li>${item}</li>`).join('')}
          </ul>
        </div>
        
        <div class="action-section">
          <div class="action-title" style="background: #8b5cf6;">长期行动（6-12个月）</div>
          <ul class="action-list">
            ${actionPlan.longTerm.map(item => `<li>${item}</li>`).join('')}
          </ul>
        </div>
      </div>
    </body>
    </html>
  `;
}
