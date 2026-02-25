import { Card, CardContent } from '@/components/ui/card';
import { Target, TrendingUp, AlertCircle, Zap } from 'lucide-react';

interface CoreSummaryProps {
  companyName: string;
  totalScore: number;
  stage: string;
  level: string;
  dimensionScores: {
    foundation: number;
    product: number;
    operation: number;
    resource: number;
    potential: number;
  };
}

export function CoreSummary({ 
  companyName, 
  totalScore, 
  stage, 
  level,
  dimensionScores 
}: CoreSummaryProps) {
  // 找出最强和最弱维度
  const dimensions = [
    { name: '基础能力', score: dimensionScores.foundation, key: 'foundation' },
    { name: '产品竞争力', score: dimensionScores.product, key: 'product' },
    { name: '运营能力', score: dimensionScores.operation, key: 'operation' },
    { name: '资源配置', score: dimensionScores.resource, key: 'resource' },
    { name: '发展潜力', score: dimensionScores.potential, key: 'potential' },
  ];
  
  const strongest = dimensions.reduce((prev, current) => 
    prev.score > current.score ? prev : current
  );
  
  const weakest = dimensions.reduce((prev, current) => 
    prev.score < current.score ? prev : current
  );

  // 阶段中文映射
  const stageMap: Record<string, string> = {
    preparation: '准备期',
    exploration: '探索期',
    growth: '成长期',
    expansion: '扩张期',
    mature: '成熟期',
  };

  // 生成核心结论
  const getSummary = () => {
    if (totalScore < 40) {
      return `${companyName}的出海基础较为薄弱，建议优先完善${weakest.name}，为出海做好准备。`;
    } else if (totalScore < 60) {
      return `${companyName}已具备初步出海条件，${strongest.name}是核心优势，建议重点补强${weakest.name}。`;
    } else if (totalScore < 80) {
      return `${companyName}出海条件较为成熟，${strongest.name}表现突出，可加速海外市场拓展。`;
    } else {
      return `${companyName}已具备国际化运营能力，综合实力强劲，可向全球化领军企业迈进。`;
    }
  };

  // 生成优先行动建议
  const getPriorityAction = () => {
    if (weakest.score < 50) {
      return `优先行动：提升${weakest.name}（当前${weakest.score}分），这是制约出海的关键因素。`;
    } else if (totalScore < 60) {
      return '优先行动：完善出海团队配置，建立基础外贸运营体系。';
    } else if (totalScore < 80) {
      return '优先行动：拓展多元化出海渠道，提升品牌国际影响力。';
    } else {
      return '优先行动：深化全球布局，建立本地化运营体系。';
    }
  };

  return (
    <Card className="border-l-4 border-l-blue-600 bg-white shadow-lg hover:shadow-xl transition-shadow">
      <CardContent className="p-6">
        {/* 标题 */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <Target className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">核心结论</h2>
            <p className="text-sm text-slate-500">基于五维评估模型的关键洞察</p>
          </div>
        </div>

        {/* 三句话总结 - 卡片式布局 */}
        <div className="space-y-4">
          {/* 第一句：现状评估 */}
          <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-medium text-blue-600 uppercase tracking-wider mb-1">现状评估</div>
              <p className="text-slate-700 leading-relaxed">
                {getSummary()}
              </p>
            </div>
          </div>

          {/* 第二句：优劣势 */}
          <div className="flex items-start gap-4 p-4 rounded-xl bg-emerald-50 border border-emerald-100">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <Zap className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-medium text-emerald-600 uppercase tracking-wider mb-1">优势与短板</div>
              <p className="text-slate-700 leading-relaxed">
                核心优势：<span className="font-semibold text-emerald-700">{strongest.name}（{strongest.score}分）</span>
                ；主要短板：
                <span className="font-semibold text-amber-700">{weakest.name}（{weakest.score}分）</span>
              </p>
            </div>
          </div>

          {/* 第三句：优先行动 */}
          <div className="flex items-start gap-4 p-4 rounded-xl bg-amber-50 border border-amber-100">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-4 h-4 text-amber-600" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-medium text-amber-600 uppercase tracking-wider mb-1">优先行动</div>
              <p className="text-slate-700 leading-relaxed font-medium">
                {getPriorityAction()}
              </p>
            </div>
          </div>
        </div>

        {/* 数据亮点 */}
        <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-3 gap-4">
          <div className="text-center p-4 rounded-xl bg-blue-50">
            <div className="text-3xl font-bold text-blue-600">{totalScore}</div>
            <div className="text-xs text-slate-500 mt-1">综合得分</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-indigo-50">
            <div className="text-lg font-bold text-indigo-600">{stageMap[stage] || stage}</div>
            <div className="text-xs text-slate-500 mt-1">出海阶段</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-violet-50">
            <div className="text-lg font-bold text-violet-600 truncate px-2" title={level}>{level}</div>
            <div className="text-xs text-slate-500 mt-1">企业等级</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
