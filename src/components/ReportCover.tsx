// 报告封面组件 - 专业蓝配色
import { Building2, TrendingUp, Award } from 'lucide-react';

interface ReportCoverProps {
  companyName: string;
  totalScore: number;
  stage: string;
  level: string;
  industry: string;
}

export function ReportCover({ companyName, totalScore, stage, level, industry }: ReportCoverProps) {
  // 阶段颜色映射
  const stageConfig: Record<string, { bg: string; accent: string; label: string }> = {
    preparation: { bg: 'from-slate-700 to-slate-800', accent: 'bg-slate-500', label: '准备期' },
    exploration: { bg: 'from-blue-700 to-blue-900', accent: 'bg-blue-500', label: '探索期' },
    growth: { bg: 'from-indigo-700 to-indigo-900', accent: 'bg-indigo-500', label: '成长期' },
    expansion: { bg: 'from-violet-700 to-violet-900', accent: 'bg-violet-500', label: '扩张期' },
    mature: { bg: 'from-purple-700 to-purple-900', accent: 'bg-purple-500', label: '成熟期' },
  };

  const config = stageConfig[stage] || stageConfig.exploration;

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${config.bg} text-white shadow-2xl`}>
      {/* 背景装饰 */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
      </div>
      
      {/* 网格背景 */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }} />

      <div className="relative px-8 py-12 md:px-16 md:py-16">
        {/* 顶部：服务部标识 */}
        <div className="flex items-center justify-center mb-8">
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="text-sm font-medium text-white/90">聊商联盟</div>
              <div className="text-xs text-white/70">海外服务部</div>
            </div>
          </div>
        </div>

        {/* 中间：企业名称和报告标题 */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-sm mb-6">
            <Award className="w-4 h-4" />
            <span>企业出海成熟度评估报告</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            {companyName}
          </h1>
          
          <div className="flex items-center justify-center gap-2 text-white/70">
            <span className="w-12 h-px bg-white/30" />
            <span className="text-sm uppercase tracking-widest">Overseas Readiness Assessment</span>
            <span className="w-12 h-px bg-white/30" />
          </div>
        </div>

        {/* 底部：核心指标 */}
        <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-2xl mx-auto">
          {/* 综合得分 */}
          <div className="text-center">
            <div className="relative inline-flex items-center justify-center mb-3">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  fill="none"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="6"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  fill="none"
                  stroke="white"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${(totalScore / 100) * 251} 251`}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold">{totalScore}</span>
                <span className="text-xs text-white/60">分</span>
              </div>
            </div>
            <div className="text-sm text-white/80">综合得分</div>
          </div>

          {/* 出海阶段 */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 mb-3">
              <TrendingUp className="w-10 h-10" />
            </div>
            <div className="text-lg font-semibold mb-1">{config.label}</div>
            <div className="text-sm text-white/60">出海阶段</div>
          </div>

          {/* 企业等级 */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 mb-3">
              <Award className="w-10 h-10" />
            </div>
            <div className="text-lg font-semibold mb-1">{level}</div>
            <div className="text-sm text-white/60">企业等级</div>
          </div>
        </div>

        {/* 行业标签 */}
        <div className="mt-10 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm">
            <span className="w-2 h-2 rounded-full bg-white/60" />
            {industry}
          </span>
        </div>
      </div>

      {/* 底部装饰线 */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
    </div>
  );
}
